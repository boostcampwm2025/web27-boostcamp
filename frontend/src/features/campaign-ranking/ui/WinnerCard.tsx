import { Card } from '@/shared/ui/Card/Card';
import { Icon } from '@/shared/ui/Icon/Icon';
import type { MatchedCampaign } from '@/shared/types/common';

interface WinnerCardProps {
  campaign: MatchedCampaign;
}

export const WinnerCard = ({ campaign }: WinnerCardProps) => {
  return (
    <Card highlight className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="trophy" size={20} className="text-success-500" />
        <h4 className="text-lg font-bold text-neutral-900">
          1등 {campaign.title}
        </h4>
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-neutral-700">
          <span className="font-medium">점수:</span> {campaign.score}점
        </p>
        <p className="text-neutral-600 mt-2">
          <span className="font-medium text-neutral-700">선택 이유:</span>{' '}
          {campaign.explain}
        </p>
      </div>
    </Card>
  );
};
