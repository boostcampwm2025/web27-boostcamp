// API Base URL (프록시 사용: /api → http://localhost:3000)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// SDK URL (외부 블로그에서 로드하므로 절대 URL 필요)
export const SDK_URL =
  import.meta.env.VITE_SDK_URL || 'http://localhost:3000/sdk.js';

// 태그 목록 (프로토타입용 - 10개 고정)
export const AVAILABLE_TAGS = [
  'JavaScript',
  'TypeScript',
  'React',
  'NextJS',
  'Spring',
  'NestJS',
  'SQL',
  'AWS',
  'Redis',
  'AI',
] as const;

export type Tag = (typeof AVAILABLE_TAGS)[number];
