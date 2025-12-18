import { useState } from 'react';
import { Card } from '@/shared/ui/Card/Card';
import { Button } from '@/shared/ui/Button/Button';
import { SponsoredBadge } from './SponsoredBadge';
import { trackClick } from '@/shared/api/clickApi';
import type { MatchedCampaign } from '@/shared/types/common';

interface AdCardProps {
  campaign: MatchedCampaign;
  onClickTracked?: () => void;
}

export const AdCard = ({ campaign, onClickTracked }: AdCardProps) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleClick = async () => {
    if (isTracking) return;

    try {
      setIsTracking(true);

      // 클릭 추적 API 호출 (전체 캠페인 정보 전송)
      const result = await trackClick(
        campaign.id,
        campaign.title,
        campaign.url
      );

      // 클릭 추적 성공 후 콜백 실행 (로그 새로고침용)
      if (onClickTracked) {
        onClickTracked();
      }

      // 추적 URL로 리디렉션
      window.open(result.redirectUrl, '_blank');
    } catch (error) {
      console.error('Failed to track click:', error);
      // 에러 발생 시에도 원래 URL로 이동
      window.open(campaign.url, '_blank');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <Card className="mt-6">
      <SponsoredBadge />
      <h2 className="text-2xl font-bold text-neutral-900 mb-3">
        {campaign.title}
      </h2>
      <p className="text-base text-neutral-700 mb-4">{campaign.content}</p>
      <Button
        variant="primary"
        onClick={handleClick}
        className="mt-4 w-full"
        disabled={isTracking}
      >
        {isTracking ? '처리 중...' : '자세히 보기 →'}
      </Button>
    </Card>
  );
};
