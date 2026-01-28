import { Icon } from '@shared/ui/Icon';
import { StatCard } from '@shared/ui/StatCard';

interface CampaignMetricsCardsProps {
  clicks: number;
  impressions: number;
  ctr: number;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function CampaignMetricsCards({
  clicks,
  impressions,
  ctr,
}: CampaignMetricsCardsProps) {
  return (
    <div className="flex gap-4">
      <StatCard
        title="캠페인 클릭 수"
        value={formatNumber(clicks)}
        icon={<Icon.Click className="w-5 h-5 text-blue-500" />}
      />
      <StatCard
        title="캠페인 노출 수"
        value={formatNumber(impressions)}
        icon={<Icon.Eye className="w-5 h-5 text-gray-400" />}
      />
      <StatCard
        title="캠페인 평균 CTR"
        value={`${ctr}%`}
        icon={<Icon.Percent className="w-5 h-5 text-blue-500" />}
      />
    </div>
  );
}
