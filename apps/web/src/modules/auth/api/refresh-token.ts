import { apiClient } from '@/lib/api-client';
import { queryClient } from '@/app/providers';

export async function refreshToken() {
  try {
    const response = await apiClient.post(
      '/auth/refresh',
      {},
      {
        withCredentials: true,
      },
    );
    if (!response.data?.success) {
      throw new Error('Refresh failed');
    }
    return response.data;
  } catch (error) {
    queryClient.setQueryData(['user'], null);
    throw error;
  }
}
