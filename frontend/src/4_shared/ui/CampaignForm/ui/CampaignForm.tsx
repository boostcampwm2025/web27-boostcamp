import type { ReactNode } from 'react';
import { Modal } from '@shared/ui/Modal';
import { useCampaignFormStore } from '../lib/campaignFormStore';
import { isStep1Valid } from '../lib/step1Validation';
import { isStep2Valid } from '../lib/step2Validation';
import { StepIndicator } from './StepIndicator';
import { FormNavigation } from './FormNavigation';

interface CampaignFormProps {
  children?: ReactNode;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function CampaignForm({
  children,
  onSubmit,
  isSubmitting = false,
}: CampaignFormProps) {
  const { currentStep, setStep, formData, balance, mode } = useCampaignFormStore();

  const isNextDisabled = () => {
    if (isSubmitting) return true;
    if (currentStep === 1) {
      return !isStep1Valid(formData.campaignContent);
    }
    if (currentStep === 2) {
      return !isStep2Valid({ ...formData.budgetSettings, balance });
    }
    return false;
  };

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
        mode={mode}
        onPrev={handlePrev}
        onNext={handleNext}
        isLastStep={currentStep === 3}
        disableNext={isNextDisabled()}
        disablePrev={isSubmitting}
      />
    </div>
  );
}
