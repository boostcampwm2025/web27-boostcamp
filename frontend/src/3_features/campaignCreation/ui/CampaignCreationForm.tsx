import type { ReactNode } from 'react';
import { Modal } from '@shared/ui/Modal';
import { useCampaignFormStore } from '../lib/campaignFormStore';
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
  const { currentStep, setStep } = useCampaignFormStore();

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
    <div className="flex w-150 flex-col gap-4">
      <StepIndicator currentStep={currentStep} />
      <Modal showHeader={false}>
        <div className="p-6">{children}</div>
      </Modal>
      <FormNavigation
        currentStep={currentStep}
        onPrev={handlePrev}
        onNext={handleNext}
        isLastStep={currentStep === 3}
      />
    </div>
  );
}
