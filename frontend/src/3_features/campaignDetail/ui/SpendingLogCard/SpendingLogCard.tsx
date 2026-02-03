import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '@shared/lib/api';
import { Pagination } from '@shared/ui/Pagination';
import { SpendingLogTableHeader } from './SpendingLogTableHeader';
import {
  SpendingLogTableRow,
  type SpendingLogRowData,
} from './SpendingLogTableRow';

interface ClickHistoryResponse {
  logs: Array<{
    id: number;
    createdAt: string;
    postUrl: string | null;
    blogName: string;
    cost: number;
    behaviorScore: number | null;
    isHighIntent: boolean;
  }>;
  total: number;
  hasMore: boolean;
}

export function SpendingLogCard() {
  const { id: campaignId } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<SpendingLogRowData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const hasMore = offset + limit < total;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const fetchClickHistory = async () => {
      if (!campaignId) return;

      try {
        setIsLoading(true);
        const data = await apiClient<ClickHistoryResponse>(
          `/api/campaigns/${campaignId}/click-history?limit=${limit}&offset=${offset}`
        );

        const mappedLogs: SpendingLogRowData[] = data.logs.map((log) => ({
          id: log.id,
          createdAt: log.createdAt,
          postUrl: log.postUrl || '',
          blogName: log.blogName,
          cpc: log.cost,
          behaviorScore: log.behaviorScore,
          isHighIntent: log.isHighIntent,
        }));

        setLogs(mappedLogs);
        setTotal(data.total);
      } catch (error) {
        console.error('클릭 히스토리 조회 실패:', error);
        setLogs([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClickHistory();
  }, [campaignId, offset]);

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

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl">
      {/* 헤더 */}
      <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">예산 소진 현황</h3>
        <span className="text-sm text-gray-500">클릭당 예산 소진 기록</span>
      </div>

      {/* 테이블 */}
      <table className="w-full">
        <SpendingLogTableHeader />
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                로딩 중...
              </td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">
                클릭 기록이 없습니다
              </td>
            </tr>
          ) : (
            logs.map((log) => <SpendingLogTableRow key={log.id} log={log} />)
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
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
