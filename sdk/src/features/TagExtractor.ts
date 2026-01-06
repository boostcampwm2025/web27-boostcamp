import type {
  TagExtractor as TagExtractorInterface,
  Tag,
} from '@/shared/types';

// 페이지의 제목과 본문에서 태그를 추출
export class TagExtractor implements TagExtractorInterface {
  constructor(private readonly tags: readonly Tag[]) {}

  extract(): Tag[] {
    // h1, h2 태그의 텍스트만 추출
    const h1Elements = Array.from(document.querySelectorAll('h1'));
    const h2Elements = Array.from(document.querySelectorAll('h2'));

    const headingTexts = [
      ...h1Elements.map(el => el.textContent || ''),
      ...h2Elements.map(el => el.textContent || '')
    ];

    const text = headingTexts.join(' ').toLowerCase();

    const extractedTags = this.tags.filter((tag) =>
      text.includes(tag.name.toLowerCase())
    );

    console.log('[DevAd SDK] 추출된 태그:', extractedTags);

    return extractedTags;
  }
}
