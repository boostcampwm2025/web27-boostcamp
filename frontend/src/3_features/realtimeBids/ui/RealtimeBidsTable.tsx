import { RealtimeBidsTableHeader } from './RealtimeBidsTableHeader';
import { RealtimeBidsTableRow } from './RealtimeBidsTableRow';
import { useRealtimeBids } from '../lib/useRealtimeBids';
import { Link } from 'react-router-dom';

export function RealtimeBidsTable() {
  const { bids, isLoading, error } = useRealtimeBids({ limit: 3 });

  if (isLoading) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-gray-900 text-xl font-bold">실시간 입찰 현황</h2>
          <Link
            to="/advertiser/dashboard/history"
            className="text-base font-bold hover:text-blue-600"
          >
            전체 히스토리 보기 →
          </Link>
        </div>
        <div className="p-10 text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-gray-900 text-xl font-bold">실시간 입찰 현황</h2>
          <Link
            to="/advertiser/dashboard/history"
            className="text-base font-bold hover:text-blue-600"
          >
            전체 히스토리 보기 →
          </Link>
        </div>
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
        <h2 className="text-gray-900 text-xl font-bold">실시간 입찰 현황</h2>
        <Link
          to="/advertiser/dashboard/history"
          className="text-base font-bold hover:text-blue-600"
        >
          전체 히스토리 보기 →
        </Link>
      </div>

      <table>
        <RealtimeBidsTableHeader />
        <tbody>
          {bids.map((bid) => (
            <RealtimeBidsTableRow key={bid.id} bid={bid} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
