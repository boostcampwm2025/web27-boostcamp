import { AccountSummaryCardList } from '@features/accountSummary';
import { CampaignStatsTable } from '@features/campaignStats';
import { RealtimeBidsTable } from '@features/realtimeBids';

export function AdvertiserDashboardPage() {
  return (
    <div className="flex flex-col gap-4 px-8 py-8 bg-gray-100">
      <AccountSummaryCardList />
      <CampaignStatsTable />
      <RealtimeBidsTable />
    </div>
  );
}
