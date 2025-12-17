import type { Tag } from '../types';

/**
 * SDK 버전
 */
export const SDK_VERSION = '0.1.0-prototype';

/**
 * API 기본 URL (환경변수에서 가져옴)
 */
export const DEFAULT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * 태그 목록 (10개 고정 - 프로토타입용)
 */
export const TAGS: Tag[] = [
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'React' },
  { id: 4, name: 'NextJS' },
  { id: 5, name: 'Spring' },
  { id: 6, name: 'NestJS' },
  { id: 7, name: 'SQL' },
  { id: 8, name: 'AWS' },
  { id: 9, name: 'Redis' },
  { id: 10, name: 'AI' },
];
