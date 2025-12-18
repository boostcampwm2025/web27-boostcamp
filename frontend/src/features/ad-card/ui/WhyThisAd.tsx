import { Badge } from '@/shared/ui/Badge/Badge';
import type { Tag } from '@/shared/types/common';

interface WhyThisAdProps {
  matchedTags: Tag[];
  reason?: string;
}

export const WhyThisAd = ({ matchedTags, reason }: WhyThisAdProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-neutral-200">
      <h4 className="text-sm font-semibold text-neutral-700 mb-2">
        💡 선택 이유:
      </h4>
      <div className="flex gap-2 flex-wrap mb-2">
        {matchedTags.map((tag) => (
          <Badge key={tag.id} variant="default">
            {tag.name} ✓
          </Badge>
        ))}
      </div>
      {reason && <p className="text-sm text-neutral-600">{reason}</p>}
    </div>
  );
};
