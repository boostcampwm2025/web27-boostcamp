import { Link } from 'react-router-dom';
import { useCampaignStats } from '../lib/useCampaignStats';
import { CampaignStatsTableHeader } from './CampaignStatsTableHeader';
import { CampaignStatsTableRow } from './CampaignStatsTableRow';

export function CampaignStatsTable() {
  const { campaigns, isLoading, error } = useCampaignStats({ limit: 3 });

  if (isLoading) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
          <h2 className="text-gray-900 text-xl font-bold">캠페인</h2>
          <Link
            to="/advertiser/dashboard/campaigns"
            className="text-base font-bold"
          >
            전체 캠페인 목록 보기 →
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
          <h2 className="text-gray-900 text-xl font-bold">캠페인</h2>
          <Link
            to="/advertiser/dashboard/campaigns"
            className="text-base font-bold"
          >
            전체 캠페인 목록 보기 →
          </Link>
        </div>
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
        <h2 className="text-gray-900 text-xl font-bold">캠페인</h2>
        <Link
          to="/advertiser/dashboard/campaigns"
          className="text-base font-bold"
        >
          전체 캠페인 목록 보기 →
        </Link>
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
