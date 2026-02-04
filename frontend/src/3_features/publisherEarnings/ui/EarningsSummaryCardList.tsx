import { StatCard } from '@shared/ui/StatCard';
import { Icon } from '@shared/ui/Icon';
import { useEarningsSummary } from '../lib/useEarningsSummary';

export function EarningsSummaryCardList() {
  const { data, isLoading, error } = useEarningsSummary();

  if (error || isLoading || !data) {
    return (
      <div className="flex flex-row gap-4 min-w-fit">
        <StatCard
          title="총 누적 수익"
          value="0원"
          icon={<Icon.Wallet className="w-8 h-8" />}
        />
        <StatCard
          title="오늘 수익"
          value="0원"
          icon={<Icon.Dollar className="w-8 h-8" />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 min-w-fit">
      <StatCard
        title="총 누적 수익"
        value={`${data.totalEarnings.toLocaleString()}원`}
        icon={<Icon.Wallet className="w-8 h-8" />}
      />
      <StatCard
        title="오늘 수익"
        value={`${data.todayEarnings.toLocaleString()}원`}
        icon={<Icon.Dollar className="w-8 h-8" />}
      />
    </div>
  );
}
