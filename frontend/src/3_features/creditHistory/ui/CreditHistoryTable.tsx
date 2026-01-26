import { useCreditHistory } from '../lib/useCreditHistory';
import { CreditHistoryTableHeader } from './CreditHistoryTableHeader';
import { CreditHistoryTableRow } from './CreditHistoryTableRow';

export function CreditHistoryTable() {
  const { histories, isLoading, error } = useCreditHistory({ limit: 20 });

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
        <div className="p-10 text-center text-gray-500">사용 내역이 없습니다</div>
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
    </div>
  );
}
