import { RealtimeBidsTableHeader } from './RealtimeBidsTableHeader';
import { RealtimeBidsTableRow } from './RealtimeBidsTableRow';
import type { BidLog } from '../lib/types';

interface RealtimeBidsTableProps {
  bids: BidLog[];
}

export function RealtimeBidsTable({ bids }: RealtimeBidsTableProps) {
  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
        <h2 className="text-gray-900 text-xl font-bold">실시간 입찰 현황</h2>
        <a href="#" className="text-base font-bold">
          전체 히스토리 보기 →
        </a>
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
