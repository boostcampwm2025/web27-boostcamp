import { Outlet } from 'react-router-dom';
import { Sidebar } from '@shared/ui/Sidebar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
