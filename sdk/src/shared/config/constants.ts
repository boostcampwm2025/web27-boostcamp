import type { Tag } from '../types';

export const SDK_VERSION = '0.1.0-prototype';

export const DEFAULT_API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`;

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
