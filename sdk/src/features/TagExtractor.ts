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

    return [...h1, ...h2].map((el) => el.textContent || '').join(' ');
  }

  private extractTagsText(): string {
    const tagTexts = new Set<string>();

    // 방법 1: rel="tag" 속성을 가진 링크 찾기 (HTML5 표준, 가장 신뢰도 높음)
    const relTagLinks = Array.from(document.querySelectorAll('a[rel="tag"]'));
    relTagLinks.forEach((el) => {
      const text = el.textContent?.trim();
      if (text) tagTexts.add(text);
    });

    // 방법 2: /tag/ URL 패턴을 가진 링크 찾기 (티스토리 URL 구조)
    const allLinks = Array.from(document.querySelectorAll('a[href*="/tag/"]'));
    allLinks.forEach((el) => {
      const text = el.textContent?.trim();
      if (text) tagTexts.add(text);
    });

    // 방법 3: 일반적인 티스토리 태그 영역 셀렉터들 시도
    const TAG_CONTAINER_SELECTORS = [
      '.box-tag',         // 기본 스킨
      '.article-tag',     // article 기반 스킨
      '.tags',            // 구형 스킨
      '.tag-list',        // 일부 커스텀 스킨
      '.entry-tags',      // entry 기반 스킨
      '[class*="tag"]',   // tag가 포함된 모든 클래스
    ];

    for (const selector of TAG_CONTAINER_SELECTORS) {
      const containers = document.querySelectorAll(selector);
      containers.forEach((container) => {
        const links = container.querySelectorAll('a');
        links.forEach((link) => {
          const text = link.textContent?.trim();
          if (text) tagTexts.add(text);
        });
      });
    }

    const result = Array.from(tagTexts).join(' ');
    if (result) {
      console.log('[DevAd SDK] 티스토리 태그 추출 성공:', result);
    } else {
      console.log('[DevAd SDK] 티스토리 태그를 찾지 못했습니다.');
    }

    return result;
  }
}
