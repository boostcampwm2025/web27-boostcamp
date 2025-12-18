import { WinnerCard } from './WinnerCard';
import type { MatchedCampaign } from '@/shared/types/common';

interface CampaignTableProps {
  campaigns: MatchedCampaign[];
}

export const CampaignTable = ({ campaigns }: CampaignTableProps) => {
  if (campaigns.length === 0) {
    return <p className="text-neutral-500 text-sm">후보 캠페인이 없습니다.</p>;
  }

  const [winner, ...others] = campaigns;

  return (
    <div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-3">후보 캠페인 순위:</h3>

      <WinnerCard campaign={winner} />

      {others.length > 0 && (
        <div className="space-y-2">
          {others.map((campaign, index) => (
            <div
              key={campaign.id}
              className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-neutral-900">
                  {index + 2}. {campaign.title}
                </h5>
                <span className="text-sm text-neutral-600">{campaign.score}점</span>
              </div>
              <p className="text-xs text-neutral-500">{campaign.explain}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
