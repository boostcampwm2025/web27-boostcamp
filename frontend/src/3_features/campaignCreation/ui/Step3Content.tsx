import { ContentHeader } from './ContentHeader';
import { ConfirmCard } from './ConfirmCard';
import { ConfirmItem } from './ConfirmItem';
import { useCampaignFormStore } from '../lib/campaignFormStore';
import { formatWithComma } from '@shared/lib/format';
import { DEFAULT_ENGAGEMENT_SCORE } from '../lib/constants';

export function Step3Content() {
  const { formData, setStep } = useCampaignFormStore();
  const { title, content, url, tags, isHighIntent, image } =
    formData.campaignContent;
  const { dailyBudget, totalBudget, maxCpc } = formData.budgetSettings;

  const keywordText = tags.map((tag) => tag.name).join(', ') || '-';

  const targetingText = isHighIntent
    ? `고의도 방문자만 (최소 Engagement Score: ${DEFAULT_ENGAGEMENT_SCORE}점)`
    : '모든 방문자';

  const contentGridItems = [
    { label: '광고 제목', value: title || '-' },
    { label: '키워드', value: keywordText },
  ];

  const contentFullItems = [
    { label: '광고 내용', value: content || '-', isLink: false },
    { label: '광고 URL', value: url || '-', isLink: true },
  ];

  const budgetGridItems = [
    {
      label: '일 예산',
      value: dailyBudget > 0 ? `${formatWithComma(dailyBudget)}원` : '-',
    },
    {
      label: '총 예산',
      value: totalBudget > 0 ? `${formatWithComma(totalBudget)}원` : '-',
    },
  ];

  const handleEditContent = () => {
    setStep(1);
  };

  const handleEditBudget = () => {
    setStep(2);
  };

  return (
    <div className="flex flex-col gap-6">
      <ContentHeader
        title="광고 캠페인 확인"
        description="아래 내용을 확인하고 광고를 시작하세요"
      />

      {/* 광고 콘텐츠 */}
      <ConfirmCard title="광고 콘텐츠" onEdit={handleEditContent}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500">광고 이미지</span>
            {image ? (
              <img
                src={image}
                alt="광고 이미지"
                className="h-40 w-full rounded-lg border border-gray-200 object-contain"
              />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-400">이미지 없음</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {contentGridItems.map((item) => (
              <ConfirmItem
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>

          {contentFullItems.map((item) => (
            <ConfirmItem
              key={item.label}
              label={item.label}
              value={item.value}
              isLink={item.isLink}
            />
          ))}
        </div>
      </ConfirmCard>

      {/* 예산 */}
      <ConfirmCard title="예산" onEdit={handleEditBudget}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {budgetGridItems.map((item) => (
              <ConfirmItem
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
          <ConfirmItem
            label="클릭당 최대 입찰가(CPC)"
            value={maxCpc > 0 ? `${formatWithComma(maxCpc)}원` : '-'}
          />
        </div>
      </ConfirmCard>

      {/* 고급 설정 */}
      <ConfirmCard title="고급 설정" onEdit={handleEditContent}>
        <ConfirmItem label="행동 타겟팅" value={targetingText} />
      </ConfirmCard>
    </div>
  );
}
