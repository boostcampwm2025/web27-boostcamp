import { useState } from 'react';
import { useCreditHistory } from '../lib/useCreditHistory';
import { CreditHistoryTableHeader } from './CreditHistoryTableHeader';
import { CreditHistoryTableRow } from './CreditHistoryTableRow';
import { Pagination } from '@shared/ui/Pagination';

export function CreditHistoryTable() {
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const { histories, total, hasMore, isLoading, error } = useCreditHistory({
    limit,
    offset,
  });

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(offset - limit);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setOffset(offset + limit);
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-gray-900 text-xl font-bold">크레딧 사용 내역</h2>
        </div>
        <div className="p-10 text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-gray-900 text-xl font-bold">크레딧 사용 내역</h2>
        </div>
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (histories.length === 0) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-gray-900 text-xl font-bold">크레딧 사용 내역</h2>
        </div>
        <div className="p-10 text-center text-gray-500">
          사용 내역이 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
        <h2 className="text-gray-900 text-xl font-bold">크레딧 사용 내역</h2>
      </div>

      <table>
        <CreditHistoryTableHeader />
        <tbody>
          {histories.map((history) => (
            <CreditHistoryTableRow key={history.id} history={history} />
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={limit}
        offset={offset}
        hasMore={hasMore}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
}
