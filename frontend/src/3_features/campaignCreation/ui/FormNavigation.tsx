import { Button } from '@shared/ui/Button';
import { Icon } from '@shared/ui/Icon';
import type { FormStep } from '../lib/types';

interface FormNavigationProps {
  currentStep: FormStep;
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
      return '광고 시작하기';
    }
    return '다음';
  };

  return (
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

      <Button
        variant="blue"
        icon={<Icon.ArrowRight className="w-3" />}
        iconPosition="right"
        onClick={onNext}
        disabled={disableNext}
      >
        {nextText()}
      </Button>

      <p>광고 시작 전 언제든 수정 가능합니다</p>
    </div>
  );
}
