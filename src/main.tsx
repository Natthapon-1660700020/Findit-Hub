import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// กำหนด QueryClient พร้อมค่า Caching เริ่มต้น
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // ป้องกันการยิง request ซ้ำโดยไม่จำเป็นเมื่อสลับแท็บ
      retry: 1,                    // ลองใหม่ 1 ครั้งหากเกิด Network Error
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);