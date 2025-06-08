// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n'; // مهم جداً

// الخطوتين الجديدتين لإضافة React Query:
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter} from "react-router-dom";

// إنشاء عميل React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
