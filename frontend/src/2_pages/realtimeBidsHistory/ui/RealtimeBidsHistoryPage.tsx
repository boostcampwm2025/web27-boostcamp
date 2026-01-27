import { useState, useMemo } from 'react';
import {
  RealtimeBidsTableHeader,
  RealtimeBidsTableRow,
  useRealtimeBids,
} from '@features/realtimeBids';
import { Pagination } from '@shared/ui/Pagination';

const ITEMS_PER_PAGE = 10;

export function RealtimeBidsHistoryPage() {
  const [offset, setOffset] = useState(0);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<number[]>([]);

  // 7일 전 날짜 계산 (메모이제이션으로 무한 루프 방지)
  const startDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
  }, []);

  const { bids, total, hasMore, isLoading, error, isConnected } =
    useRealtimeBids({
      limit: ITEMS_PER_PAGE,
      offset,
      startDate,
      campaignIds: selectedCampaignIds,
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

  const handleCampaignChange = (campaignIds: number[]) => {
    setSelectedCampaignIds(campaignIds);
    setOffset(0); // 필터 변경 시 첫 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-xl shadow">
          <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-gray-900 text-xl font-bold">입찰 히스토리</h2>
              {offset === 0 && selectedCampaignIds.length === 0 && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isConnected ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {isConnected ? '실시간 연결됨' : '연결 안됨'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">최근 7일간의 입찰 기록</p>
          </div>

          {isLoading ? (
            <div className="p-10 text-center text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="p-10 text-center text-red-500">{error}</div>
          ) : (
            <>
              <table className="w-full">
                <RealtimeBidsTableHeader
                  selectedCampaignIds={selectedCampaignIds}
                  onCampaignChange={handleCampaignChange}
                />
                <tbody>
                  {bids.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-gray-500">
                        입찰 기록이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    bids.map((bid) => (
                      <RealtimeBidsTableRow key={bid.id} bid={bid} />
                    ))
                  )}
                </tbody>
              </table>

              {bids.length > 0 && (
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
