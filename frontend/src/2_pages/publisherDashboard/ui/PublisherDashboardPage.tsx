import {
  EarningsSummaryCardList,
  EarningsHistoryTable,
} from '@features/publisherEarnings';
import { useDocumentTitle } from '@shared/lib/hooks';

export function PublisherDashboardPage() {
  useDocumentTitle('대시보드');
  return (
    <div className="min-h-screen flex flex-col gap-4 px-8 py-8 bg-gray-50">
      <EarningsSummaryCardList />
      <EarningsHistoryTable />
    </div>
  );
}
