import { RealtimeBidsTableHeader } from './RealtimeBidsTableHeader';
import { RealtimeBidsTableRow } from './RealtimeBidsTableRow';
import { useRealtimeBids } from '../lib/useRealtimeBids';
import { Link } from 'react-router-dom';

export function RealtimeBidsTable() {
  const { bids, isLoading, error, isConnected } = useRealtimeBids({ limit: 5 });

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
        <div className="flex items-center gap-3">
          <h2 className="text-gray-900 text-xl font-bold">실시간 입찰 현황</h2>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600">실시간 연결됨</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="text-xs text-gray-500">연결 대기 중</span>
              </>
            )}
          </div>
        </div>
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
