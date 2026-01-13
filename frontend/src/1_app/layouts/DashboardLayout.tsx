import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@shared/ui/Sidebar';
import { Header } from '@shared/ui/Header';

export function DashboardLayout() {
  const location = useLocation();
  const isAdvertiser = location.pathname.startsWith('/advertiser');
  const title = isAdvertiser ? 'Advertiser Dashboard' : 'Publisher Dashboard';

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-50">
        <Header title={title} />
        <Outlet />
      </main>
    </div>
  );
}
