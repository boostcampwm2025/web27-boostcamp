import { StatsCard } from './StatsCard';
import { Icon } from '@shared/ui/Icon';

export function StatsCardList() {
  return (
    <div className="flex flex-row gap-4 min-w-fit">
      <StatsCard
        title="전체 광고비 집행 수"
        value="685"
        change="+23"
        icon={<Icon.Click className="w-8 h-8" />}
      />
      <StatsCard
        title="전체 광고비 노출 수"
        value="1802"
        change="+48"
        icon={<Icon.Eye className="w-8 h-8" />}
      />
      <StatsCard
        title="평균 노출당 클릭률 (CTR)"
        value="2.8%"
        change="0.03%"
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
