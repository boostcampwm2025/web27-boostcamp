import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DemoPage } from '@/pages/demo/ui/DemoPage';

export const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoPage />} />
      </Routes>
    </BrowserRouter>
  );
};
