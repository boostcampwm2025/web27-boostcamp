import {
  CampaignCreationForm,
  Step1Content,
  Step2Content,
  Step3Content,
  useCampaignForm,
} from '@features/campaignCreation';

export function CampaignCreatePage() {
  const { currentStep } = useCampaignForm();

  const handleSubmit = () => {
    // TODO: 실제 광고 생성 API 호출 및 페이지 이동 로직 구현 필요!
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-gray-100 pt-16">
      <CampaignCreationForm onSubmit={handleSubmit}>
        {currentStep === 1 && <Step1Content />}
        {currentStep === 2 && <Step2Content />}
        {currentStep === 3 && <Step3Content />}
      </CampaignCreationForm>
    </div>
  );
}
