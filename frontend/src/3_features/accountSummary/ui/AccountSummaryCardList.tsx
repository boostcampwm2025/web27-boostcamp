import { AccountSummaryCard } from './AccountSummaryCard';
import { Icon } from '@shared/ui/Icon';
import { useAccountSummary } from '../lib/useAccountSummary';

export function AccountSummaryCardList() {
  const { data, isLoading, error } = useAccountSummary();

  // 에러가 있거나 로딩 중이거나 데이터가 없으면 0 값 표시
  if (error || isLoading || !data) {
    return (
      <div className="flex flex-row gap-4 min-w-fit">
        <AccountSummaryCard
          title="전체 광고 클릭 수"
          value="0"
          change="+0"
          icon={<Icon.Click className="w-8 h-8" />}
        />
        <AccountSummaryCard
          title="전체 광고 노출 수"
          value="0"
          change="+0"
          icon={<Icon.Eye className="w-8 h-8" />}
        />
        <AccountSummaryCard
          title="평균 노출당 클릭률 (CTR)"
          value="0.0%"
          change="0.00%"
          icon={<Icon.Percent className="w-8 h-8" />}
        />
        <AccountSummaryCard
          title="총 사용"
          value="0원"
          icon={<Icon.Dollar className="w-8 h-8" />}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 min-w-fit">
      <AccountSummaryCard
        title="전체 캠페인 클릭 수"
        value={data.totalClicks.toLocaleString()}
        change={
          data.clicksChange > 0
            ? `+${data.clicksChange}`
            : `${data.clicksChange}`
        }
        icon={<Icon.Click className="w-8 h-8" />}
      />
      <AccountSummaryCard
        title="전체 캠페인 노출 수"
        value={data.totalImpressions.toLocaleString()}
        change={
          data.impressionsChange > 0
            ? `+${data.impressionsChange}`
            : `${data.impressionsChange}`
        }
        icon={<Icon.Eye className="w-8 h-8" />}
      />
      <AccountSummaryCard
        title="평균 노출당 클릭률 (CTR)"
        value={`${data.averageCtr}%`}
        change={
          data.averageCtrChange > 0
            ? `+${data.averageCtrChange}%`
            : `${data.averageCtrChange}%`
        }
        icon={<Icon.Percent className="w-8 h-8" />}
      />
      <AccountSummaryCard
        title="총 사용"
        value={`${data.totalSpent.toLocaleString()}원`}
        icon={<Icon.Dollar className="w-8 h-8" />}
      />
    </div>
  );
}
