import { Outlet } from 'react-router-dom';
import { Sidebar } from '@shared/ui/Sidebar';
import { Header } from '@shared/ui/Header';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-50">
        <Header title="Advertiser Dashboard" />
        <Outlet />
      </main>
    </div>
  );
}
