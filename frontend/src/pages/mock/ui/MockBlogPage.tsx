import { useEffect, useState } from 'react';
import type { Tag } from '@/shared/config/constants';
import { useDevAdSDK } from '@/features/sdk-tester/hooks/useDevAdSDK';
import TagSelector from '@/features/sdk-tester/ui/TagSelector';
import BlogHeader from '@/features/blog-content/ui/BlogHeader';
import BlogArticle from '@/features/blog-content/ui/BlogArticle';
import BlogFooter from '@/features/blog-content/ui/BlogFooter';

// Mock 블로그 페이지 컴포넌트
export default function MockBlogPage() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([
    'React',
    'TypeScript',
  ]);

  const { sdkLoaded, sdkError, reloadSDK } = useDevAdSDK();

  // 태그 변경 시 광고 새로고침
  useEffect(() => {
    if (sdkLoaded) {
      reloadSDK();
    }
  }, [selectedTags, sdkLoaded, reloadSDK]);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader />

      <TagSelector
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        sdkLoaded={sdkLoaded}
        sdkError={sdkError}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <BlogArticle selectedTags={selectedTags} />

        {/* 광고 존 - SDK가 자동으로 광고 렌더링 */}
        <div className="flex justify-center mb-8">
          <div data-devad-zone></div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
