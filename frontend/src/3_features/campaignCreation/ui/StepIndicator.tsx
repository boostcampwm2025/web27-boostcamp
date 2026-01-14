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
    <div>
      <div>
        <span>
          STEP {currentStep} OF {totalSteps}
        </span>
        <span>{Math.round(progressPercentage)}% Completed</span>
      </div>

      <div>
        <div style={{ width: `${progressPercentage}%` }} />
      </div>

      <h2>{getStepTitle(currentStep)}</h2>
    </div>
  );
}
