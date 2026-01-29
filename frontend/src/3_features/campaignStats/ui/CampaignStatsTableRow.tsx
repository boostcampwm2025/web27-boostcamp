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
      className="text-sm border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      onClick={handleClick}
    >
      <td className="px-5 py-4 text-gray-900 font-semibold hover:text-blue-600">
        {campaign.title}
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
    </tr>
  );
}
