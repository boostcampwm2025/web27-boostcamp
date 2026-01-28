import { useState } from 'react';
import { Icon } from '@shared/ui/Icon';
import { Button } from '@shared/ui/Button';
import { BudgetProgressSection } from './BudgetProgressSection';
import { BudgetInfoSection } from './BudgetInfoSection';
import { BudgetEditMode } from './BudgetEditMode';

interface BudgetStatusCardProps {
  dailySpent: number;
  dailyBudget: number;
  dailySpentPercent: number;
  totalSpent: number;
  totalBudget: number | null;
  totalSpentPercent: number;
  maxCpc: number;
  balance: number | null;
  onChargeBudget: () => void;
  onUpdateBudget: (data: {
    totalBudget: number;
    dailyBudget: number;
    maxCpc: number;
  }) => Promise<void>;
  isUpdateLoading?: boolean;
}

export function BudgetStatusCard({
  dailySpent,
  dailyBudget,
  dailySpentPercent,
  totalSpent,
  totalBudget,
  totalSpentPercent,
  maxCpc,
  balance,
  onChargeBudget,
  onUpdateBudget,
  isUpdateLoading = false,
}: BudgetStatusCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (data: {
    totalBudget: number;
    dailyBudget: number;
    maxCpc: number;
  }) => {
    await onUpdateBudget(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={`p-6 bg-white rounded-xl border-2 transition-colors ${
        isEditing ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          예산 및 지출 현황
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="white"
            size="xs"
            icon={<Icon.Saving className="w-4 h-4" />}
            iconPosition="left"
            onClick={onChargeBudget}
          >
            예산 충전
          </Button>
          <Button
            variant={isEditing ? 'white' : 'blue'}
            size="xs"
            icon={<Icon.Pen className="w-4 h-4" />}
            iconPosition="left"
            onClick={() => setIsEditing(!isEditing)}
          >
            빠른 예산 수정
          </Button>
        </div>
      </div>

      {/* 바디 */}
      <div className="flex gap-6">
        {/* 프로그래스바*/}
        <div className="flex-3">
          <BudgetProgressSection
            dailySpent={dailySpent}
            dailyBudget={dailyBudget}
            dailySpentPercent={dailySpentPercent}
            totalSpent={totalSpent}
            totalBudget={totalBudget}
            totalSpentPercent={totalSpentPercent}
          />
        </div>

        {/* 예산 정보 또는 편집 */}
        <div className="flex-2 flex flex-col items-end p-5 gap-4 bg-slate-50 border border-slate-200 rounded-xl">
          {isEditing ? (
            <BudgetEditMode
              currentTotalBudget={totalBudget}
              currentDailyBudget={dailyBudget}
              currentMaxCpc={maxCpc}
              balance={balance}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={isUpdateLoading}
            />
          ) : (
            <BudgetInfoSection
              totalBudget={totalBudget}
              dailyBudget={dailyBudget}
              maxCpc={maxCpc}
            />
          )}
        </div>
      </div>
    </div>
  );
}
