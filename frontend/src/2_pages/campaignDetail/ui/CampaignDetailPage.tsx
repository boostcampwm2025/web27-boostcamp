import { useParams, useNavigate } from 'react-router-dom';
import {
  useCampaignDetail,
  usePauseCampaign,
  useUpdateBudget,
  CampaignDetailHeader,
  CampaignInfoCard,
  CampaignMetricsCards,
  BudgetStatusCard,
  SpendingLogCard,
} from '@features/campaignDetail';
import { useAdvertiserBalance } from '@shared/lib/hooks/useAdvertiserBalance';
import { useToast } from '@shared/lib/toast';

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { campaign, isLoading, error, refetch } = useCampaignDetail(id || '');
  const { togglePause, isLoading: isPauseLoading } = usePauseCampaign();
  const { updateBudget, isLoading: isUpdateBudgetLoading } = useUpdateBudget();
  const { balance } = useAdvertiserBalance();

  const handleBack = () => {
    navigate('/advertiser/dashboard/campaigns');
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
    // TODO: 수정 모달 열기
    console.log('Edit campaign');
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
        <div className="text-red-500">{error || '캠페인을 찾을 수 없습니다'}</div>
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
    </div>
  );
}
