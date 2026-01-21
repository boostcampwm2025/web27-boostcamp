import type { CampaignStats } from '../lib/types';
import { CampaignStatsTableHeader } from './CampaignStatsTableHeader';
import { CampaignStatsTableRow } from './CampaignStatsTableRow';

// Mock 데이터 (API 연동 시 삭제)
const mockCampaigns: CampaignStats[] = [
  {
    id: 'campaign-001',
    title: '캠페인 A next.js 배워보기',
    status: 'ACTIVE',
    impressions: 384,
    clicks: 109,
    ctr: 28.84,
    dailySpentPercent: 23,
    totalSpentPercent: 80.14,
    isHighIntent: true,
  },
  {
    id: 'campaign-002',
    title: '캠페인 B nest.js 배워보기',
    status: 'PAUSED',
    impressions: 384,
    clicks: 109,
    ctr: 28.84,
    dailySpentPercent: 81,
    totalSpentPercent: 25.24,
    isHighIntent: true,
  },
  {
    id: 'campaign-003',
    title: '캠페인 C Mysql 완전 정복',
    status: 'ENDED',
    impressions: 384,
    clicks: 109,
    ctr: 28.84,
    dailySpentPercent: 94,
    totalSpentPercent: 65.23,
    isHighIntent: false,
  },
];

export function CampaignStatsTable() {
  // TODO: API 연동 시 useCampaignStats 사용할 것!
  // const { campaigns, isLoading, error } = useCampaignStats({ limit: 3 });
  const campaigns = mockCampaigns;
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-gray-900 text-xl font-bold">캠페인</h2>
          <a href="#" className="text-base font-bold">
            전체 캠페인 목록 보기 →
          </a>
        </div>
        <div className="p-10 text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-gray-900 text-xl font-bold">캠페인</h2>
          <a href="#" className="text-base font-bold">
            전체 캠페인 목록 보기 →
          </a>
        </div>
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
        <h2 className="text-gray-900 text-xl font-bold">캠페인</h2>
        <a href="#" className="text-base font-bold">
          전체 캠페인 목록 보기 →
        </a>
      </div>

      <table>
        <CampaignStatsTableHeader />
        <tbody>
          {campaigns.map((campaign) => (
            <CampaignStatsTableRow key={campaign.id} campaign={campaign} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
