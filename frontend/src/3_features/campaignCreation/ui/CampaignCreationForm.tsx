import type { ReactNode } from 'react';
import { useCampaignForm } from '../lib/useCampaignForm';
import { StepIndicator } from './StepIndicator';
import { FormNavigation } from './FormNavigation';

interface CampaignCreationFormProps {
  children?: ReactNode;
  onSubmit?: () => void;
}

export function CampaignCreationForm({
  children,
  onSubmit,
}: CampaignCreationFormProps) {
  const { currentStep, setStep } = useCampaignForm();

  const handlePrev = () => {
    if (currentStep === 2) {
      setStep(1);
    } else if (currentStep === 3) {
      setStep(2);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setStep(2);
    } else if (currentStep === 2) {
      setStep(3);
    } else if (currentStep === 3 && onSubmit) {
      onSubmit();
    }
  };

  return (
    <div>
      <StepIndicator currentStep={currentStep} />
      <div>{children}</div>
      <FormNavigation
        currentStep={currentStep}
        onPrev={handlePrev}
        onNext={handleNext}
        isLastStep={currentStep === 3}
      />
    </div>
  );
}
