import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CampaignCreationForm,
  Step1Content,
  Step2Content,
  Step3Content,
  useCampaignFormStore,
  useCreateCampaign,
  useAdvertiserBalance,
} from '@features/campaignCreation';

export function CampaignCreatePage() {
  const navigate = useNavigate();
  const { currentStep, formData, resetForm, setBalance } =
    useCampaignFormStore();
  const { createCampaign, isLoading, error } = useCreateCampaign();
  const { balance } = useAdvertiserBalance();

  useEffect(() => {
    if (balance !== null) {
      setBalance(balance);
    }
  }, [balance, setBalance]);

  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      await createCampaign(formData);
      resetForm();
      navigate('/advertiser/dashboard/main');
    } catch {
      // error는 useCreateCampaign에서 처리됨!
    }
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-gray-100 py-16">
      <CampaignCreationForm onSubmit={handleSubmit} isSubmitting={isLoading}>
        {currentStep === 1 && <Step1Content />}
        {currentStep === 2 && <Step2Content />}
        {currentStep === 3 && <Step3Content />}
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </CampaignCreationForm>
    </div>
  );
}
