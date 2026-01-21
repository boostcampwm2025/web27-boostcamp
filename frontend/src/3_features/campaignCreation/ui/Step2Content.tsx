import { ContentHeader } from './ContentHeader';
import { CurrencyField } from './CurrencyField';
import { useCampaignFormStore } from '../lib/campaignFormStore';

const MIN_DAILY_BUDGET = 3000;

export function Step2Content() {
  const { formData, updateBudgetSettings, errors, setErrors } =
    useCampaignFormStore();
  const { dailyBudget, totalBudget, maxCpc } = formData.budgetSettings;

  const handleDailyBudgetChange = (value: number) => {
    updateBudgetSettings({ dailyBudget: value });
  };

  const handleTotalBudgetChange = (value: number) => {
    updateBudgetSettings({ totalBudget: value });
  };

  const handleMaxCpcChange = (value: number) => {
    updateBudgetSettings({ maxCpc: value });
  };

  const handleDailyBudgetBlur = () => {
    if (dailyBudget > 0 && dailyBudget < MIN_DAILY_BUDGET) {
      setErrors({
        budgetSettings: {
          dailyBudget: `최소 ${MIN_DAILY_BUDGET.toLocaleString()}원 이상 입력해주세요`,
        },
      });
    } else {
      setErrors({});
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ContentHeader
        title="예산 설정"
        description="광고에 사용할 예산을 설정해주세요"
      />

      <CurrencyField
        label="일 예산"
        value={dailyBudget}
        onChange={handleDailyBudgetChange}
        onBlur={handleDailyBudgetBlur}
        hint={`(최소 ${MIN_DAILY_BUDGET.toLocaleString()}원)`}
        error={errors.budgetSettings?.dailyBudget}
      />

      <CurrencyField
        label="총 예산"
        value={totalBudget}
        onChange={handleTotalBudgetChange}
        hint="(약 30일 진행)"
        error={errors.budgetSettings?.totalBudget}
      />

      <CurrencyField
        label="클릭당 최대 입찰가 (CPC)"
        value={maxCpc}
        onChange={handleMaxCpcChange}
        hint="(광고 입찰 참여 금액)"
        error={errors.budgetSettings?.maxCpc}
      />
    </div>
  );
}
