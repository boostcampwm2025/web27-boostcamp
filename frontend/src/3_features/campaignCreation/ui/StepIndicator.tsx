import type { FormStep } from '../lib/types';

interface StepIndicatorProps {
  currentStep: FormStep;
  totalSteps?: number;
}

export function StepIndicator({
  currentStep,
  totalSteps = 3,
}: StepIndicatorProps) {
  // 진행률 = (현재 단계 / 전체 단계 * 100)
  const progressPercentage = (currentStep / totalSteps) * 100;

  const getStepTitle = (step: FormStep) => {
    const titles = {
      1: '광고 내용',
      2: '예산 설정',
      3: '확인',
    };
    return titles[step];
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          STEP {currentStep} OF {totalSteps}
          <span className="pl-2 text-gray-500">{getStepTitle(currentStep)}</span>
        </span>
        <span className="text-sm font-medium text-blue-500">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
