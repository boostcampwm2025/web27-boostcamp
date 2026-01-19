import type { CampaignStats } from '../lib/types';
import { Icon } from '@shared/ui/Icon';
import { BudgetProgressBar } from './BudgetProgressBar';

interface CampaignStatsTableRowProps {
  campaign: CampaignStats;
}

export function CampaignStatsTableRow({
  campaign,
}: CampaignStatsTableRowProps) {
  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'ACTIVE':
        return (
          <div className="flex flex-row items-center gap-1 px-1.5 py-0.5 bg-green-100 border border-green-300 rounded-lg text-xs font-semibold text-green-500 w-fit">
            <Icon.Circle className="w-3 h-3 text-green-500" />
            진행중
          </div>
        );
      case 'PAUSED':
        return (
          <div className="flex flex-row items-center gap-1 px-1.5 py-0.5 bg-red-100 border border-red-300 rounded-lg text-xs font-semibold text-red-700 w-fit">
            <Icon.Circle className="w-3 h-3 text-red-700" />
            일시정지
          </div>
        );
      case 'PENDING':
        return (
          <div className="flex flex-row items-center gap-1 px-1.5 py-0.5 bg-yellow-100 border border-yellow-300 rounded-lg text-xs font-semibold text-yellow-600 w-fit">
            <Icon.Circle className="w-3 h-3 text-yellow-500" />
            대기
          </div>
        );
      case 'ENDED':
        return (
          <div className="flex flex-row items-center gap-1 px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded-lg text-xs font-semibold text-gray-500 w-fit">
            <Icon.Circle className="w-3 h-3 text-gray-500" />
            종료
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <tr className="text-sm border-b border-gray-100">
      <td className="px-5 py-4 text-gray-900 font-semibold">
        {campaign.title}
      </td>
      <td className="px-5 py-4">{getStatusBadge()}</td>
      <td className="px-5 py-4 text-gray-900">{campaign.impressions}</td>
      <td className="px-5 py-4 text-gray-900">{campaign.clicks}</td>
      <td className="px-5 py-4 text-gray-900">{campaign.ctr.toFixed(2)}%</td>
      <td className="px-5 py-4">
        <BudgetProgressBar percentage={campaign.dailySpentPercent} />
      </td>
      <td className="px-5 py-4 text-gray-900">{campaign.totalSpentPercent}%</td>
      <td className="px-5 py-4 text-gray-900 text-sm">
        {campaign.isHighIntent ? '고의도 학습자' : '모든 학습자'}
      </td>
    </tr>
  );
}
