import { Badge } from '@/shared/ui/Badge/Badge';
import { CampaignTable } from '@/features/campaign-ranking/ui/CampaignTable';
import { ClickLog } from '@/features/click-tracker/ui/ClickLog';
import type { Tag, MatchedCampaign, ClickLog as ClickLogType } from '@/shared/types/common';

interface DebugSectionProps {
  selectedTags: Tag[];
  candidates: MatchedCampaign[];
  clickLogs: ClickLogType[];
  isLoadingLogs?: boolean;
}

export const DebugSection = ({
  selectedTags,
  candidates,
  clickLogs,
  isLoadingLogs,
}: DebugSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">이 광고가 선택된 이유</h2>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 mb-2">현재 선택된 태그:</h3>
          <div className="flex gap-2 flex-wrap">
            {selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <Badge key={tag.id} variant="default">
                  {tag.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-neutral-500">선택된 태그가 없습니다</p>
            )}
          </div>
        </div>

        <CampaignTable campaigns={candidates} />
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
        {isLoadingLogs ? (
          <p className="text-neutral-500 text-sm">로딩 중...</p>
        ) : (
          <ClickLog logs={clickLogs} />
        )}
      </div>
    </div>
  );
};
