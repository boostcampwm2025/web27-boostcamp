import { Card } from '@/shared/ui/Card/Card';
import type { BlogPost as BlogPostType } from '@/shared/types/common';

interface BlogPostProps {
  post: BlogPostType;
}

export const BlogPost = ({ post }: BlogPostProps) => {
  return (
    <Card>
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">{post.title}</h1>
      <div className="text-base text-neutral-700 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
    </Card>
  );
};
