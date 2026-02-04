import { useState } from 'react';
import { useEarningsHistory } from '../lib/useEarningsHistory';
import { EarningsHistoryTableHeader } from './EarningsHistoryTableHeader';
import { EarningsHistoryTableRow } from './EarningsHistoryTableRow';
import { Pagination } from '@shared/ui/Pagination';

const ITEMS_PER_PAGE = 5;

export function EarningsHistoryTable() {
  const [offset, setOffset] = useState(0);
  const { data, total, hasMore, isLoading, error } = useEarningsHistory({
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
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl">
      {/* 헤더 */}
      <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">수익 발생 현황</h3>
        <span className="text-sm text-gray-500">클릭당 수익 발생 기록</span>
      </div>

      {/* 테이블 */}
      <table className="w-full">
        <EarningsHistoryTableHeader />
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                로딩 중...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                수익 기록이 없습니다
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <EarningsHistoryTableRow
                key={`${item.clickedAt}-${index}`}
                item={item}
              />
            ))
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
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
    </div>
  );
}
