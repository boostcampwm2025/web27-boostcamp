import { RouterProvider, ToastProvider } from '@app/providers';

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider />
    </ToastProvider>
  );
}
