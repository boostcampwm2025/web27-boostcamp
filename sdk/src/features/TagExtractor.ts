import type { TagExtractor as TagExtractorInterface, Tag } from '@shared/types';

export class TagExtractor implements TagExtractorInterface {
  private readonly CONTENT_SELECTORS = [
    '#mArticle',
    '.area_view',
    '#tt-body-page',
    '.article-view',
    '.post-content',
    '.entry-content',
    'article',
    '.content',
  ];

  private readonly TAG_CONTAINER_SELECTORS = [
    '.box-tag',
    '.article-tag',
    '.tags',
    '.tag-list',
    '.entry-tags',
    '[class*="tag"]',
  ];

  constructor(private readonly tags: readonly Tag[]) {}

  extract(): Tag[] {
    const h1h2Text = this.extractH1H2Text();
    const tagsText = this.extractTagsText();
    const allText = (h1h2Text + ' ' + tagsText).toLowerCase();

    const extractedTags = this.tags.filter((tag) =>
      allText.includes(tag.name.toLowerCase())
    );

    console.log('[BoostAD SDK] 추출된 태그:', extractedTags);
    return extractedTags;
  }

  private findContentArea(): Element {
    for (const selector of this.CONTENT_SELECTORS) {
      const element = document.querySelector(selector);
      if (element) {
        console.log('[BoostAD SDK] 본문 영역:', selector);
        return element;
      }
    }
    console.warn('[BoostAD SDK] 본문 영역 미발견, body 사용');
    return document.body;
  }

  private extractH1H2Text(): string {
    const contentArea = this.findContentArea();
    const headings = contentArea.querySelectorAll('h1, h2');
    return Array.from(headings)
      .map((el) => el.textContent || '')
      .join(' ');
  }

  private extractTagsText(): string {
    const contentArea = this.findContentArea();
    const tagTexts = new Set<string>();

    const collectTagTexts = (links: NodeListOf<Element>) => {
      links.forEach((link) => {
        const text = link.textContent?.trim();
        if (text) tagTexts.add(text);
      });
    };

    collectTagTexts(contentArea.querySelectorAll('a[rel="tag"]'));
    collectTagTexts(contentArea.querySelectorAll('a[href*="/tag/"]'));

    for (const selector of this.TAG_CONTAINER_SELECTORS) {
      const containers = contentArea.querySelectorAll(selector);
      if (containers.length > 0) {
        containers.forEach((container) => {
          collectTagTexts(container.querySelectorAll('a'));
        });
        break;
      }
    }

    if (tagTexts.size === 0 && contentArea.nextElementSibling) {
      for (const selector of this.TAG_CONTAINER_SELECTORS) {
        const container =
          contentArea.nextElementSibling.querySelector(selector);
        if (container) {
          collectTagTexts(container.querySelectorAll('a'));
          break;
        }
      }
    }

    const result = Array.from(tagTexts).join(' ');
    console.log('[BoostAD SDK] 태그 텍스트:', result);
    return result;
  }
}
