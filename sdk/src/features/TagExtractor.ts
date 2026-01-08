import type {
  TagExtractor as TagExtractorInterface,
  Tag,
} from '@/shared/types';

// 페이지의 제목과 본문에서 태그를 추출
export class TagExtractor implements TagExtractorInterface {
  constructor(private readonly tags: readonly Tag[]) {}

  extract(): Tag[] {
    // h1, h2 + 티스토리 .tags 영역에서 추출
    const h1h2Text = this.extractH1H2Text();
    const tagsText = this.extractTagsText();

    const allText = (h1h2Text + ' ' + tagsText).toLowerCase();

    const extractedTags = this.tags.filter((tag) =>
      allText.includes(tag.name.toLowerCase())
    );

    console.log('[DevAd SDK] 추출된 태그:', extractedTags);

    return extractedTags;
  }

  private extractH1H2Text(): string {
    const h1 = Array.from(document.querySelectorAll('h1'));
    const h2 = Array.from(document.querySelectorAll('h2'));

    return [...h1, ...h2]
      .map(el => el.textContent || '')
      .join(' ');
  }

  private extractTagsText(): string {
    // 티스토리 .tags .items a 태그들에서 추출
    const tagLinks = Array.from(document.querySelectorAll('.tags .items a'));
    return tagLinks
      .map(el => el.textContent || '')
      .join(' ');
  }
}
