import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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
  maxContentHeight?: string;
}

export function CampaignForm({
  children,
  onSubmit,
  isSubmitting = false,
  maxContentHeight,
}: CampaignFormProps) {
  const navigate = useNavigate();
  const { currentStep, setStep, formData, balance, mode, initialTotalBudget } =
    useCampaignFormStore();

  const isEditMode = mode === 'edit';

  const isNextDisabled = () => {
    if (isSubmitting) return true;
    if (currentStep === 1) {
      const isContentValid = isStep1Valid(formData.campaignContent);
      if (isEditMode) {
        const { startDate, endDate } = formData.budgetSettings;
        const isDateValid =
          startDate !== '' && endDate !== '' && endDate >= startDate;
        return !isContentValid || !isDateValid;
      }
      return !isContentValid;
    }
    if (currentStep === 2) {
      return !isStep2Valid({
        ...formData.budgetSettings,
        balance,
        isEditMode,
        initialTotalBudget: initialTotalBudget ?? undefined,
      });
    }
    return false;
  };

  const handlePrev = () => {
    if (currentStep === 2) {
      setStep(1);
    } else if (currentStep === 3) {
      setStep(isEditMode ? 1 : 2);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setStep(isEditMode ? 3 : 2);
    } else if (currentStep === 2) {
      setStep(3);
    } else if (currentStep === 3 && onSubmit) {
      onSubmit();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex w-150 flex-col gap-4">
      <StepIndicator
        currentStep={currentStep}
        mode={mode}
        onBack={handleBack}
      />
      <Modal showHeader={false}>
        <div
          className="p-6"
          style={
            maxContentHeight
              ? { maxHeight: maxContentHeight, overflowY: 'auto' }
              : undefined
          }
        >
          {children}
        </div>
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
