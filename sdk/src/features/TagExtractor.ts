import type { TagExtractor as TagExtractorInterface } from '@/shared/types';

// 페이지의 제목과 본문에서 태그를 추출
export class TagExtractor implements TagExtractorInterface {
  constructor(private readonly tags: readonly string[]) {}

  extract(): string[] {
    const title = document.querySelector('h1')?.textContent || '';
    const article = document.querySelector('article');
    const content = article ? article.textContent : document.body.textContent;
    const text = (title + ' ' + content).toLowerCase();

    return this.tags.filter((tag) => text.includes(tag.toLowerCase()));
  }
}
