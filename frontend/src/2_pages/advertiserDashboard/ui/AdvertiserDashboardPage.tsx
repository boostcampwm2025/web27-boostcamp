import { AccountSummaryCardList } from '@features/accountSummary';
import { CampaignStatsTable } from '@features/campaignStats';
import { KeywordStatsCard } from '@features/keywordStats';
import { RealtimeBidsTable } from '@features/realtimeBids';
import { useDocumentTitle } from '@shared/lib/hooks';

export function AdvertiserDashboardPage() {
  useDocumentTitle('대시보드');
  return (
    <div className="min-h-screen flex flex-col gap-4 px-8 py-8 bg-gray-50">
      {' '}
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
