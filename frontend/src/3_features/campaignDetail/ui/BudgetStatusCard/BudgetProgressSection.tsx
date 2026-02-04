import { ProgressBar } from '@shared/ui/ProgressBar';
import { formatWithComma } from '@shared/lib/format';

interface BudgetProgressSectionProps {
  dailySpent: number;
  dailyBudget: number;
  dailySpentPercent: number;
  totalSpent: number;
  totalBudget: number | null;
  totalSpentPercent: number;
}

export function BudgetProgressSection({
  dailySpent,
  dailyBudget,
  dailySpentPercent,
  totalSpent,
  totalBudget,
  totalSpentPercent,
}: BudgetProgressSectionProps) {
  const safeDaily = dailySpent ?? 0;
  const safeTotal = totalSpent ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* 오늘 소진 예산 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">오늘 소진 예산</span>
          <span className="text-sm text-gray-900">
            <span className="font-semibold">
              {safeDaily === 0 ? '0' : formatWithComma(safeDaily)}원
            </span>
            <span className="text-gray-400">
              {' '}
              / {formatWithComma(dailyBudget)}원
            </span>
          </span>
        </div>
        <div className="w-full">
          <ProgressBar
            percentage={dailySpentPercent ?? 0}
            colorScheme="blue"
            showLabel={false}
            size="md"
          />
        </div>
      </div>

      {/* 총 소진 예산 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">총 소진 예산</span>
          <span className="text-sm text-gray-900">
            <span className="font-semibold">
              {safeTotal === 0 ? '0' : formatWithComma(safeTotal)}원
            </span>
            <span className="text-gray-400">
              {' '}
              / {totalBudget ? formatWithComma(totalBudget) : '-'}원
            </span>
          </span>
        </div>
        <div className="w-full">
          <ProgressBar
            percentage={totalSpentPercent ?? 0}
            colorScheme="blue"
            showLabel={false}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
