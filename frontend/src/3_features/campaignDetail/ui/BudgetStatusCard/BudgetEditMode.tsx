import { useState } from 'react';
import { CurrencyField } from '@shared/ui/CurrencyField';
import { formatWithComma } from '@shared/lib/format';

interface BudgetEditModeProps {
  currentTotalBudget: number | null;
  currentDailyBudget: number;
  currentMaxCpc: number;
  balance: number | null;
  onSave: (data: {
    totalBudget: number;
    dailyBudget: number;
    maxCpc: number;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const QUICK_ADD_OPTIONS = [
  { label: '+1만원', value: 10000 },
  { label: '+3만원', value: 30000 },
  { label: '+5만원', value: 50000 },
];

export function BudgetEditMode({
  currentTotalBudget,
  currentDailyBudget,
  currentMaxCpc,
  balance,
  onSave,
  onCancel,
  isLoading = false,
}: BudgetEditModeProps) {
  const [addBudget, setAddBudget] = useState(0);
  const [dailyBudget, setDailyBudget] = useState(currentDailyBudget);
  const [maxCpc, setMaxCpc] = useState(currentMaxCpc);

  const finalTotalBudget = (currentTotalBudget || 0) + addBudget;

  const handleQuickAdd = (value: number) => {
    setAddBudget((prev) => prev + value);
  };

  const handleSave = () => {
    onSave({
      totalBudget: finalTotalBudget,
      dailyBudget,
      maxCpc,
    });
  };

  return (
    <div className="flex flex-col items-start gap-4 w-full">
      {/* 총예산 영역 */}
      <div className="flex flex-row items-start gap-4 w-full">
        <span className="text-sm font-bold text-slate-500 uppercase shrink-0">
          총 예산
        </span>

        <div className="flex flex-col gap-2 flex-1">
          {/* 현재 총예산 값 */}
          <div className="flex flex-row items-center gap-1">
            <span className="text-base font-bold text-blue-500">
              {formatWithComma(finalTotalBudget)}
            </span>
            <span className="text-sm font-medium text-slate-400">원</span>
          </div>

          {/* 추가 예산 입력 */}
          <div className="bg-white">
            <CurrencyField
              value={addBudget}
              onChange={setAddBudget}
              prefix="+"
            />
          </div>

          {/* 퀵버튼 */}
          <div className="flex flex-row justify-between items-center gap-2">
            {QUICK_ADD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleQuickAdd(option.value)}
                className="flex flex-1 justify-center items-center px-3 h-8 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* 예산 잔액 표시 */}
          <span className="text-xs font-bold text-right text-slate-400 uppercase">
            예산 잔액: {balance !== null ? formatWithComma(balance) : '-'} 원
          </span>
        </div>
      </div>

      {/* 일일 예산 */}
      <div className="flex flex-row items-center gap-3.5 w-full self-stretch">
        <span className="text-sm font-bold text-slate-500 uppercase">
          일일 예산
        </span>
        <div className="flex-1 bg-white">
          <CurrencyField value={dailyBudget} onChange={setDailyBudget} />
        </div>
      </div>

      {/* 최대 CPC */}
      <div className="flex flex-row items-center gap-3 w-full self-stretch">
        <span className="text-sm font-bold text-slate-500 uppercase">
          최대 CPC
        </span>
        <div className="flex-1 bg-white">
          <CurrencyField value={maxCpc} onChange={setMaxCpc} />
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col items-start pt-2 w-full">
        <div className="flex flex-row items-start gap-2 w-full self-stretch">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 flex justify-center items-center py-2 bg-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 flex justify-center items-center py-2 bg-blue-500 rounded-lg text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
