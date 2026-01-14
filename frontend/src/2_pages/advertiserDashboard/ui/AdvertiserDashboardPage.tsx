import { StatsCardList } from '@features/dashboardStats/ui/StatsCardList';
import { RealtimeBidsTable } from '@features/realtimeBids';

export function AdvertiserDashboardPage() {
  return (
    <div className="flex flex-col gap-4 px-8 py-8 bg-gray-100">
      <StatsCardList />
      <RealtimeBidsTable />
    </div>
  );
}
