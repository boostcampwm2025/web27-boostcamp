import { useEffect } from 'react';
import {
  CampaignForm,
  Step1Content,
  Step2Content,
  Step3Content,
  useCampaignFormStore,
} from '@shared/ui/CampaignForm';
import type { CampaignFormData } from '@shared/ui/CampaignForm';
import { useImageUpload } from '@shared/lib/hooks';

interface CampaignEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  isSubmitting: boolean;
  initialData: {
    title: string;
    content: string;
    url: string;
    tags: { id: number; name: string }[];
    isHighIntent: boolean;
    image: string | null;
    dailyBudget: number;
    totalBudget: number | null;
    maxCpc: number;
    startDate: string;
    endDate: string;
  };
  balance: number | null;
  error?: string | null;
}

// 날짜 포맷 변환 (ISO -> YYYY-MM-DD)
function formatDateForInput(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CampaignEditModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  balance,
  error,
}: CampaignEditModalProps) {
  const {
    currentStep,
    setMode,
    setStep,
    setFormData,
    setBalance,
    setInitialTotalBudget,
    formData,
    resetForm,
  } = useCampaignFormStore();
  const { upload: uploadImage } = useImageUpload();

  useEffect(() => {
    if (isOpen) {
      setMode('edit');
      setStep(1);
      setBalance(balance);
      setInitialTotalBudget(initialData.totalBudget);
      setFormData({
        campaignContent: {
          title: initialData.title,
          content: initialData.content,
          url: initialData.url,
          tags: initialData.tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            category: '기타' as const,
          })),
          isHighIntent: initialData.isHighIntent,
          image: initialData.image,
        },
        budgetSettings: {
          dailyBudget: initialData.dailyBudget,
          totalBudget: initialData.totalBudget || 0,
          maxCpc: initialData.maxCpc,
          startDate: formatDateForInput(initialData.startDate),
          endDate: formatDateForInput(initialData.endDate),
        },
      });
    }
  }, [
    isOpen,
    initialData,
    balance,
    setMode,
    setStep,
    setFormData,
    setBalance,
    setInitialTotalBudget,
  ]);

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col gap-2 bg-white/90 p-4 rounded-xl">
        {/* 닫기 버튼 */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 hover:bg-blue-500/80 transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            <span className="text-white text-lg">✕</span>
          </button>
        </div>

        <CampaignForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          maxContentHeight="calc(100vh - 250px)"
        >
          {currentStep === 1 && <Step1Content onImageUpload={uploadImage} />}
          {currentStep === 2 && <Step2Content />}
          {currentStep === 3 && <Step3Content />}
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
        </CampaignForm>
      </div>
    </div>
  );
}
