import { AccountSummaryCardList } from '@features/accountSummary';
import { CampaignStatsTable } from '@features/campaignStats';
import { KeywordStatsCard } from '@features/keywordStats';
import { RealtimeBidsTable } from '@features/realtimeBids';

export function AdvertiserDashboardPage() {
  return (
    <div className="flex flex-col gap-4 px-8 py-8 bg-gray-100">
      <AccountSummaryCardList />
      <CampaignStatsTable />
      <div className="flex flex-row gap-4">
        <div className="flex-[2.5]">
          <RealtimeBidsTable />
        </div>
        <div className="flex-1">
          <KeywordStatsCard />
        </div>
      </div>
    </div>
  );
}
