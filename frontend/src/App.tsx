import { ToastProvider } from '@app/providers';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/providers';

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
