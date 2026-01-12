import { RouterProvider } from '@app/providers';
import { ToastProvider } from '@shared/ui/Toast';

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider />
    </ToastProvider>
  );
}
