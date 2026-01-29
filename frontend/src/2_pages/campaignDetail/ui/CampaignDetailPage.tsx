import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useCampaignDetail,
  usePauseCampaign,
  useUpdateBudget,
  useUpdateCampaign,
  CampaignDetailHeader,
  CampaignInfoCard,
  CampaignMetricsCards,
  BudgetStatusCard,
  SpendingLogCard,
  CampaignEditModal,
} from '@features/campaignDetail';
import { useAdvertiserBalance } from '@shared/lib/hooks/useAdvertiserBalance';
import { useToast } from '@shared/lib/toast';
import type { CampaignFormData } from '@shared/ui/CampaignForm';

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { campaign, isLoading, error, refetch } = useCampaignDetail(id || '');
  const { togglePause, isLoading: isPauseLoading } = usePauseCampaign();
  const { updateBudget, isLoading: isUpdateBudgetLoading } = useUpdateBudget();
  const {
    updateCampaign,
    isLoading: isUpdateCampaignLoading,
    error: updateCampaignError,
  } = useUpdateCampaign();
  const { balance, refetch: refetchBalance } = useAdvertiserBalance();

  const handleBack = () => {
    navigate(-1);
  };

  const handlePause = async () => {
    if (!campaign) return;

    try {
      await togglePause(campaign.id, campaign.status);
      toast.showToast(
        campaign.status === 'ACTIVE'
          ? '캠페인이 일시정지되었습니다'
          : '캠페인이 재개되었습니다',
        'success'
      );
      refetch();
    } catch {
      toast.showToast('캠페인 상태 변경에 실패했습니다', 'error');
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async (formData: CampaignFormData) => {
    if (!campaign) return;

    try {
      await updateCampaign(campaign.id, {
        title: formData.campaignContent.title,
        content: formData.campaignContent.content,
        url: formData.campaignContent.url,
        image: formData.campaignContent.image || undefined,
        tags: formData.campaignContent.tags.map((tag) => tag.name),
        isHighIntent: formData.campaignContent.isHighIntent,
        maxCpc: formData.budgetSettings.maxCpc,
        dailyBudget: formData.budgetSettings.dailyBudget,
        totalBudget: formData.budgetSettings.totalBudget,
        endDate: formData.budgetSettings.endDate,
      });
      toast.showToast('캠페인이 수정되었습니다', 'success');
      setIsEditModalOpen(false);
      refetch();
      refetchBalance();
    } catch {
      toast.showToast('캠페인 수정에 실패했습니다', 'error');
    }
  };

  const handleChargeBudget = () => {
    navigate('/advertiser/dashboard/budget');
  };

  const handleUpdateBudget = async (data: {
    totalBudget: number;
    dailyBudget: number;
    maxCpc: number;
  }) => {
    if (!campaign) return;

    try {
      await updateBudget(campaign.id, data);
      toast.showToast('예산이 수정되었습니다', 'success');
      refetch();
      refetchBalance();
    } catch {
      toast.showToast('예산 수정에 실패했습니다', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-red-500">
          {error || '캠페인을 찾을 수 없습니다'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-8 py-8 bg-gray-100 min-h-screen">
      <CampaignDetailHeader
        title={campaign.title}
        status={campaign.status}
        onBack={handleBack}
        onPause={handlePause}
        onEdit={handleEdit}
        isPauseLoading={isPauseLoading}
      />

      <CampaignInfoCard
        image={campaign.image}
        title={campaign.title}
        content={campaign.content}
        tags={campaign.tags}
        url={campaign.url}
        isHighIntent={campaign.isHighIntent}
        startDate={campaign.startDate}
        endDate={campaign.endDate}
      />

      <CampaignMetricsCards
        clicks={campaign.clicks}
        impressions={campaign.impressions}
        ctr={campaign.ctr}
      />

      <BudgetStatusCard
        dailySpent={campaign.dailySpent}
        dailyBudget={campaign.dailyBudget}
        dailySpentPercent={campaign.dailySpentPercent}
        totalSpent={campaign.totalSpent}
        totalBudget={campaign.totalBudget}
        totalSpentPercent={campaign.totalSpentPercent}
        maxCpc={campaign.maxCpc}
        balance={balance}
        onChargeBudget={handleChargeBudget}
        onUpdateBudget={handleUpdateBudget}
        isUpdateLoading={isUpdateBudgetLoading}
      />

      <SpendingLogCard />

      {/* 캠페인 수정 모달 */}
      <CampaignEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdateCampaignLoading}
        initialData={{
          title: campaign.title,
          content: campaign.content,
          url: campaign.url,
          tags: campaign.tags,
          isHighIntent: campaign.isHighIntent,
          image: campaign.image,
          dailyBudget: campaign.dailyBudget,
          totalBudget: campaign.totalBudget,
          maxCpc: campaign.maxCpc,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
        }}
        balance={balance}
        error={updateCampaignError}
      />
    </div>
  );
}
