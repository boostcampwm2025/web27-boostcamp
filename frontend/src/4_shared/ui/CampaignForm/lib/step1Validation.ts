import type { Tag } from './types';

export function validateImage(image: string | null) {
  if (!image) {
    return '이미지를 업로드해주세요.';
  }
  return null;
}

export function validateTitle(title: string) {
  if (!title.trim()) {
    return '광고 제목을 입력해주세요.';
  }
  return null;
}

export function validateContent(content: string) {
  if (!content.trim()) {
    return '광고 내용을 입력해주세요.';
  }
  return null;
}

export function validateUrl(url: string) {
  if (!url.trim()) {
    return '광고 URL을 입력해주세요.';
  }

  try {
    new URL(url);
  } catch {
    return '올바른 URL 형식이 아닙니다.';
  }

  return null;
}

export function validateTags(tags: Tag[]) {
  if (tags.length === 0) {
    return '키워드를 최소 1개 이상 선택해주세요.';
  }
  return null;
}

interface Step1ValidationParams {
  image: string | null;
  title: string;
  content: string;
  url: string;
  tags: Tag[];
}

export function isStep1Valid(params: Step1ValidationParams) {
  const { image, title, content, url, tags } = params;

  return (
    validateImage(image) === null &&
    validateTitle(title) === null &&
    validateContent(content) === null &&
    validateUrl(url) === null &&
    validateTags(tags) === null
  );
}
