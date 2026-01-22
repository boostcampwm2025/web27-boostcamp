import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@shared/ui/Sidebar';
import { Header } from '@shared/ui/Header';
import { Button } from '@shared/ui/Button';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdvertiser = location.pathname.startsWith('/advertiser');
  const title = isAdvertiser ? 'Advertiser Dashboard' : 'Publisher Dashboard';

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-50">
        <Header
          title={title}
          actions={
            isAdvertiser ? (
              <Button size="sm" onClick={() => navigate('/advertiser/campaign-create')}>
                캠페인 생성
              </Button>
            ) : null
          }
        />
        <Outlet />
      </main>
    </div>
  );
}
