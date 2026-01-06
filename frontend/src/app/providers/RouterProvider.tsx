import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DemoPage } from '@/pages/demo/ui/DemoPage';
import { SlideBDemo } from '@/pages/demo/slide-b-demo';

export const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoPage />} />
        <Route path="/slide-b-demo" element={<SlideBDemo />} />
      </Routes>
    </BrowserRouter>
  );
};
