import { formatWithComma } from '@shared/lib/format';

interface BudgetInfoSectionProps {
  totalBudget: number | null;
  dailyBudget: number;
  maxCpc: number;
}

export function BudgetInfoSection({
  totalBudget,
  dailyBudget,
  maxCpc,
}: BudgetInfoSectionProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">총 예산</span>
        <span className="text-sm font-semibold text-gray-900">
          {totalBudget ? formatWithComma(totalBudget) : '-'}원
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">일일 예산</span>
        <span className="text-sm font-semibold text-gray-900">
          {formatWithComma(dailyBudget)}원
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">최대 CPC</span>
        <span className="text-sm font-semibold text-gray-900">
          {formatWithComma(maxCpc)}원
        </span>
      </div>
    </div>
  );
}
