import type { Tag, BlogPost } from '../types/common';

export const AVAILABLE_TAGS: Tag[] = [
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

export const DUMMY_POST: BlogPost = {
  title: 'NestJS로 확장 가능한 REST API 만들기',
  content: `
    NestJS는 TypeScript 기반의 프레임워크로,
    확장 가능하고 유지보수가 쉬운 서버 사이드 애플리케이션을 만들 수 있습니다.

    이 글에서는 NestJS의 핵심 개념과 실전 활용법을 다룹니다.
  `,
  autoTags: [
    { id: 2, name: 'TypeScript' },
    { id: 6, name: 'NestJS' },
  ],
};
