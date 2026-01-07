import { StatsCard } from './StatsCard';
import { Icon } from '@shared/ui/Icon';
import { useStats } from '../lib/useStats';

export function StatsCardList() {
  const { data, isLoading, error } = useStats();

  if (error) {
    return (
      <div className="flex flex-row gap-4 min-w-fit">
        <div className="p-5 text-red-500">오류: {error}</div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex flex-row gap-4 min-w-fit">
        <StatsCard
          title="전체 광고비 집행 수"
          value="0"
          change="+0"
          icon={<Icon.Click className="w-8 h-8" />}
        />
        <StatsCard
          title="전체 광고비 노출 수"
          value="0"
          change="+0"
          icon={<Icon.Eye className="w-8 h-8" />}
        />
        <StatsCard
          title="평균 노출당 클릭률 (CTR)"
          value="0.0%"
          change="0.00%"
          icon={<Icon.Percent className="w-8 h-8" />}
        />
        <StatsCard
          title="총 사용"
          value="0원"
          icon={<Icon.Dollar className="w-8 h-8" />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 min-w-fit">
      <StatsCard
        title="전체 광고비 집행 수"
        value={data.totalClicks.toLocaleString()}
        change={
          data.clicksChange > 0
            ? `+${data.clicksChange}`
            : `${data.clicksChange}`
        }
        icon={<Icon.Click className="w-8 h-8" />}
      />
      <StatsCard
        title="전체 광고비 노출 수"
        value={data.totalImpressions.toLocaleString()}
        change={
          data.impressionsChange > 0
            ? `+${data.impressionsChange}`
            : `${data.impressionsChange}`
        }
        icon={<Icon.Eye className="w-8 h-8" />}
      />
      <StatsCard
        title="평균 노출당 클릭률 (CTR)"
        value={`${data.averageCtr}%`}
        change={
          data.averageCtrChange > 0
            ? `+${data.averageCtrChange}%`
            : `${data.averageCtrChange}%`
        }
        icon={<Icon.Percent className="w-8 h-8" />}
      />
      <StatsCard
        title="총 사용"
        value="72,500원"
        icon={<Icon.Dollar className="w-8 h-8" />}
      />
    </div>
  );
}
