import { useNavigate } from 'react-router-dom';
import type { CampaignStats } from '../lib/types';
import { StatusBadge } from '@shared/ui/StatusBadge';
import { ProgressBar } from '@shared/ui/ProgressBar';

interface CampaignStatsTableRowProps {
  campaign: CampaignStats;
}

export function CampaignStatsTableRow({
  campaign,
}: CampaignStatsTableRowProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/advertiser/dashboard/campaigns/${campaign.id}`);
  };

  return (
    <tr
      className="text-sm border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group"
      onClick={handleClick}
    >
      <td className="px-5 py-4 text-gray-900 font-medium max-w-50">
        <div className="line-clamp-2">{campaign.title}</div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <StatusBadge status={campaign.status} />
      </td>
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap">
        {campaign.impressions}
      </td>
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap">
        {campaign.clicks}
      </td>
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap">
        {campaign.ctr.toFixed(2)}%
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <ProgressBar percentage={campaign.dailySpentPercent} />
      </td>
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap">
        {campaign.totalSpentPercent}%
      </td>
      <td className="px-5 py-4 text-gray-900 text-sm whitespace-nowrap">
        {campaign.isHighIntent ? '고의도 학습자' : '모든 학습자'}
      </td>
      <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </td>
    </tr>
  );
}
