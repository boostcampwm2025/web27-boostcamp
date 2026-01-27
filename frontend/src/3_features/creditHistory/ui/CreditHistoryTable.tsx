import { useState } from 'react';
import { useCreditHistory } from '../lib/useCreditHistory';
import { CreditHistoryTableHeader } from './CreditHistoryTableHeader';
import { CreditHistoryTableRow } from './CreditHistoryTableRow';
import { Button } from '@shared/ui/Button';

export function CreditHistoryTable() {
  const [page, setPage] = useState(0);
  const limit = 5;
  const offset = page * limit;

  const { histories, total, hasMore, isLoading, error } = useCreditHistory({
    limit,
    offset,
  });

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

  const totalPages = Math.ceil(total / limit);
  const canGoPrev = page > 0;
  const canGoNext = hasMore;

  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
        <h2 className="text-gray-900 text-xl font-bold">크레딧 사용 내역</h2>
        <div className="text-sm text-gray-600">
          전체 {total}건 | {page + 1} / {totalPages} 페이지
        </div>
      </div>

      <table>
        <CreditHistoryTableHeader />
        <tbody>
          {histories.map((history) => (
            <CreditHistoryTableRow key={history.id} history={history} />
          ))}
        </tbody>
      </table>

      <div className="p-4 flex justify-center gap-2 border-t border-gray-100">
        <Button
          variant="white"
          size="sm"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={!canGoPrev}
        >
          이전
        </Button>
        <div className="flex items-center px-4 text-sm text-gray-700">
          {page + 1} / {totalPages}
        </div>
        <Button
          variant="white"
          size="sm"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!canGoNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
