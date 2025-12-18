import { useEffect } from 'react';
import { RouterProvider } from './app/providers/RouterProvider';
import './app/styles/globals.css';

function App() {
  // SDK 동적 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      import.meta.env.VITE_SDK_URL || 'http://localhost:3000/sdk.js';
    script.dataset.blogId = 'demo-blog';
    script.dataset.apiBase =
      import.meta.env.VITE_API_URL || 'http://localhost:3000';
    script.async = true;

    document.head.appendChild(script);

    return () => {
      // 클린업: SDK 스크립트 제거
      document.head.removeChild(script);
    };
  }, []);

  return <RouterProvider />;
}

export default App;
