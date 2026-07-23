import { refreshToken } from '@/modules/auth/api/refresh-token';
import { apiClient } from './api-client';
import { queryClient } from '@/app/providers';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const resetRefreshState = () => {
  isRefreshing = false;
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Skip refresh mechanism for authentication endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // If already retried or not 401, reject
    if (originalRequest._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      resetRefreshState();
      queryClient.setQueryData(['user'], null);
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await refreshToken();
      processQueue(null, 'refreshed');
      return apiClient(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      queryClient.setQueryData(['user'], null);
      return Promise.reject(refreshErr);
    } finally {
      resetRefreshState();
    }
  },
);
