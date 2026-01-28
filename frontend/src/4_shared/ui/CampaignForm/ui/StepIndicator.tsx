import { Icon } from '@shared/ui/Icon';
import type { FormStep, CampaignFormMode } from '../lib/types';

interface StepIndicatorProps {
  currentStep: FormStep;
  totalSteps?: number;
  mode?: CampaignFormMode;
  onBack?: () => void;
}

export function StepIndicator({
  currentStep,
  totalSteps = 3,
  mode = 'create',
  onBack,
}: StepIndicatorProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  const getStepTitle = (step: FormStep) => {
    const titles = {
      1: '광고 내용',
      2: '예산 설정',
      3: '확인',
    };
    return titles[step];
  };

  const isCreateMode = mode === 'create';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        {isCreateMode ? (
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Icon.ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-900">
              STEP {currentStep} OF {totalSteps}
              <span className="pl-2 text-gray-500">
                {getStepTitle(currentStep)}
              </span>
            </span>
          </div>
        ) : (
          <span className="text-sm font-medium text-gray-900">
            STEP {currentStep} OF {totalSteps}
            <span className="pl-2 text-gray-500">
              {getStepTitle(currentStep)}
            </span>
          </span>
        )}
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
