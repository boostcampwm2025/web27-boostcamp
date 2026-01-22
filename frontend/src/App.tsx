import { ToastProvider } from '@app/providers';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/providers';
import { QueryProvider } from './1_app/providers/QueryProvider';

export default function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryProvider>
  );
}
