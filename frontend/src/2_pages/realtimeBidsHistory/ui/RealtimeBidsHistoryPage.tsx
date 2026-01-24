import { useState, useMemo } from 'react';
import {
  RealtimeBidsTableHeader,
  RealtimeBidsTableRow,
  useRealtimeBids,
} from '@features/realtimeBids';

const ITEMS_PER_PAGE = 10;

export function RealtimeBidsHistoryPage() {
  const [offset, setOffset] = useState(0);

  // 7일 전 날짜 계산 (메모이제이션으로 무한 루프 방지)
  const startDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
  }, []);

  const { bids, total, hasMore, isLoading, error } = useRealtimeBids({
    limit: ITEMS_PER_PAGE,
    offset,
    startDate,
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow">
          <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
            <h2 className="text-gray-900 text-xl font-bold">입찰 히스토리</h2>
            <p className="text-sm text-gray-600">최근 7일간의 입찰 기록</p>
          </div>

          {isLoading ? (
            <div className="p-10 text-center text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="p-10 text-center text-red-500">{error}</div>
          ) : bids.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              입찰 기록이 없습니다.
            </div>
          ) : (
            <>
              <table className="w-full">
                <RealtimeBidsTableHeader />
                <tbody>
                  {bids.map((bid) => (
                    <RealtimeBidsTableRow key={bid.id} bid={bid} />
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  전체 {total}개 중 {offset + 1}-
                  {Math.min(offset + ITEMS_PER_PAGE, total)}개
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={offset === 0}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
