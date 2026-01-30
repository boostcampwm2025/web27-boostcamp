import { useState } from 'react';
import {
  useCampaignStats,
  CampaignStatsTableHeader,
  CampaignStatsTableRow,
} from '@features/campaignStats';
import { Pagination } from '@shared/ui/Pagination';
import { useDocumentTitle } from '@shared/lib/hooks';

const ITEMS_PER_PAGE = 10;

export function AdvertiserCampaignsPage() {
  useDocumentTitle('캠페인 관리');
  const [offset, setOffset] = useState(0);
  const { campaigns, total, hasMore, isLoading, error } = useCampaignStats({
    limit: ITEMS_PER_PAGE,
    offset,
  });

  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(offset - ITEMS_PER_PAGE);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setOffset(offset + ITEMS_PER_PAGE);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-xl shadow">
          <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
            <h2 className="text-gray-900 text-xl font-bold">캠페인 관리</h2>
          </div>
          {isLoading ? (
            <div className="p-10 text-center text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="p-10 text-center text-red-500">{error}</div>
          ) : campaigns.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              등록된 캠페인이 없습니다.
            </div>
          ) : (
            <>
              <table className="w-full">
                <CampaignStatsTableHeader />
                <tbody>
                  {campaigns.map((campaign) => (
                    <CampaignStatsTableRow
                      key={campaign.id}
                      campaign={campaign}
                    />
                  ))}
                </tbody>
              </table>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={ITEMS_PER_PAGE}
                offset={offset}
                hasMore={hasMore}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
