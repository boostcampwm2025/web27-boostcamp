import { useState } from 'react';
import { Pagination } from '@shared/ui/Pagination';
import { SpendingLogTableHeader } from './SpendingLogTableHeader';
import {
  SpendingLogTableRow,
  type SpendingLogRowData,
} from './SpendingLogTableRow';

// Mock 데이터 생성
function generateMockData(): SpendingLogRowData[] {
  const blogs = [
    { name: '데브로그', url: 'https://devlog.io/react-hooks-guide' },
    { name: '코딩하는 플레미', url: 'https://flemi.dev/typescript-tips' },
    { name: '프론트엔드 마스터', url: 'https://femaster.kr/nextjs-tutorial' },
    { name: '백엔드 개발 일지', url: 'https://backend-daily.com/nodejs-best' },
    { name: 'JS 마스터 블로그', url: 'https://jsmaster.blog/es2024-features' },
    { name: '테크 인사이트', url: 'https://techinsight.io/web-performance' },
    { name: '개발자 K', url: 'https://dev-k.blog/clean-code-tips' },
    { name: '코드랩', url: 'https://codelab.kr/docker-kubernetes' },
  ];

  const cpcValues = [500, 550, 480, 620, 450, 580, 520, 490];
  const now = new Date();
  const logs: SpendingLogRowData[] = [];

  for (let i = 0; i < 15; i++) {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - i * 8);

    const isHighIntent = i % 3 !== 1;
    const blog = blogs[i % blogs.length];

    logs.push({
      id: i + 1,
      createdAt: date.toISOString(),
      postUrl: blog.url,
      blogName: blog.name,
      cpc: cpcValues[i % cpcValues.length],
      behaviorScore: isHighIntent ? Math.floor(Math.random() * 25) + 75 : null,
      isHighIntent,
    });
  }

  return logs;
}

const MOCK_DATA = generateMockData();

export function SpendingLogCard() {
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const total = MOCK_DATA.length;
  const hasMore = offset + limit < total;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const logs = MOCK_DATA.slice(offset, offset + limit);

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
          {logs.map((log) => (
            <SpendingLogTableRow key={log.id} log={log} />
          ))}
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
