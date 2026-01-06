import { Badge } from '@/shared/ui/Badge/Badge';
import type { Tag } from '@/shared/types/common';

interface AutoTagsProps {
  tags: Tag[];
}

export const AutoTags = ({ tags }: AutoTagsProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-neutral-700 mb-2">
        자동 추출 태그:
      </h3>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="default">
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};
