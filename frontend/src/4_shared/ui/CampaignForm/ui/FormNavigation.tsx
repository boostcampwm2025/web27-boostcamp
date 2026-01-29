import { Button } from '@shared/ui/Button';
import { Icon } from '@shared/ui/Icon';
import type { FormStep, CampaignFormMode } from '../lib/types';

interface FormNavigationProps {
  currentStep: FormStep;
  mode?: CampaignFormMode;
  onPrev?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
  nextButtonText?: string;
  prevButtonText?: string;
  disableNext?: boolean;
  disablePrev?: boolean;
}

export function FormNavigation({
  currentStep,
  mode = 'create',
  onPrev,
  onNext,
  isLastStep = false,
  nextButtonText,
  prevButtonText = '이전',
  disableNext = false,
  disablePrev = false,
}: FormNavigationProps) {
  const nextText = () => {
    if (nextButtonText) {
      return nextButtonText;
    }
    if (isLastStep) {
      return mode === 'edit' ? '수정 완료' : '광고 시작하기';
    }
    return '다음';
  };

  const hintText =
    mode === 'edit'
      ? '수정 사항을 확인해주세요'
      : '광고 시작 전 언제든 수정 가능합니다';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              variant="white"
              icon={<Icon.ArrowLeft className="w-3" />}
              iconPosition="left"
              onClick={onPrev}
              disabled={disablePrev}
            >
              {prevButtonText}
            </Button>
          )}
        </div>

        <Button
          variant="blue"
          icon={<Icon.ArrowRight className="w-3" />}
          iconPosition="right"
          onClick={onNext}
          disabled={disableNext}
        >
          {nextText()}
        </Button>
      </div>

      <p className={`text-right text-xs text-gray-500`}>{hintText}</p>
    </div>
  );
}
