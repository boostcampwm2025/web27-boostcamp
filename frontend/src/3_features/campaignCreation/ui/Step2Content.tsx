import { ContentHeader } from './ContentHeader';
import { CurrencyField } from './CurrencyField';
import { DateField } from './DateField';
import { useCampaignFormStore } from '../lib/campaignFormStore';
import {
  validateStartDate,
  validateEndDate,
  validateMaxCpc,
  validateDailyBudget,
  validateTotalBudget,
  MIN_DAILY_BUDGET,
} from '../lib/step2Validation';

export function Step2Content() {
  const { formData, updateBudgetSettings, errors, setErrors, balance } =
    useCampaignFormStore();
  const { dailyBudget, totalBudget, maxCpc, startDate, endDate } =
    formData.budgetSettings;

  const balanceHint =
    balance !== null
      ? `(보유 잔액: ${balance.toLocaleString()}원)`
      : '(잔액 조회 중...)';

  const handleDailyBudgetChange = (value: number) => {
    updateBudgetSettings({ dailyBudget: value });
  };

  const handleTotalBudgetChange = (value: number) => {
    updateBudgetSettings({ totalBudget: value });
  };

  const handleMaxCpcChange = (value: number) => {
    updateBudgetSettings({ maxCpc: value });
  };

  const handleMaxCpcBlur = () => {
    const error = validateMaxCpc(maxCpc, dailyBudget);
    setErrors({
      budgetSettings: {
        ...errors.budgetSettings,
        maxCpc: error || undefined,
      },
    });
  };

  const handleDailyBudgetBlur = () => {
    const error = validateDailyBudget(dailyBudget, totalBudget, maxCpc);
    setErrors({
      budgetSettings: {
        ...errors.budgetSettings,
        dailyBudget: error || undefined,
      },
    });
  };

  const handleTotalBudgetBlur = () => {
    const error = validateTotalBudget(totalBudget, dailyBudget, balance);
    setErrors({
      budgetSettings: {
        ...errors.budgetSettings,
        totalBudget: error || undefined,
      },
    });
  };

  const handleStartDateChange = (value: string) => {
    updateBudgetSettings({ startDate: value });
  };

  const handleEndDateChange = (value: string) => {
    updateBudgetSettings({ endDate: value });
  };

  const handleStartDateBlur = () => {
    const error = validateStartDate(startDate);
    setErrors({
      budgetSettings: {
        ...errors.budgetSettings,
        startDate: error || undefined,
      },
    });
  };

  const handleEndDateBlur = () => {
    const error = validateEndDate(startDate, endDate);
    setErrors({
      budgetSettings: {
        ...errors.budgetSettings,
        endDate: error || undefined,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <ContentHeader
        title="예산 및 기간 설정"
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
        onBlur={handleTotalBudgetBlur}
        hint={balanceHint}
        error={errors.budgetSettings?.totalBudget}
      />

      <CurrencyField
        label="클릭당 최대 입찰가 (CPC)"
        value={maxCpc}
        onChange={handleMaxCpcChange}
        onBlur={handleMaxCpcBlur}
        hint="(광고 입찰 참여 금액)"
        error={errors.budgetSettings?.maxCpc}
      />

      <div className="grid grid-cols-2 gap-4">
        <DateField
          label="시작일"
          value={startDate}
          onChange={handleStartDateChange}
          onBlur={handleStartDateBlur}
          error={errors.budgetSettings?.startDate}
        />

        <DateField
          label="종료일"
          value={endDate}
          onChange={handleEndDateChange}
          onBlur={handleEndDateBlur}
          min={startDate}
          error={errors.budgetSettings?.endDate}
        />
      </div>
    </div>
  );
}
