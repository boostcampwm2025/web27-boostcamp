import { StatsCardList } from '@/features/dashboardStats/ui/StatsCardList';

export function AdvertiserDashboardPage() {
  return (
    <div className="min-h-screen px-48 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold">광고주 대시보드</h1>
      <StatsCardList />
    </div>
  );
}
