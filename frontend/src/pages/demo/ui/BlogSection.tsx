import { BlogPost } from '@/features/blog-post/ui/BlogPost';
import { TagSelector } from '@/features/tag-selector/ui/TagSelector';
import { AutoTags } from '@/features/tag-selector/ui/AutoTags';
import { AdCard } from '@/features/ad-card/ui/AdCard';
import type { BlogPost as BlogPostType, Tag, MatchedCampaign } from '@/shared/types/common';

interface BlogSectionProps {
  post: BlogPostType;
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
  adCampaign: MatchedCampaign | null;
  onClickTracked?: () => void;
}

export const BlogSection = ({
  post,
  availableTags,
  selectedTags,
  onTagToggle,
  adCampaign,
  onClickTracked,
}: BlogSectionProps) => {
  return (
    <div className="space-y-6">
      <BlogPost post={post} />

      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
        <AutoTags tags={post.autoTags} />
        <TagSelector
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagToggle={onTagToggle}
        />
      </div>

      {adCampaign && <AdCard campaign={adCampaign} onClickTracked={onClickTracked} />}
    </div>
  );
};
