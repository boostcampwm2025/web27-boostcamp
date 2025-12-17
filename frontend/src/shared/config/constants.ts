import type { Tag, Campaign, BlogPost, ClickLog } from '../types/common';

/**
 * 선택 가능한 태그 목록 (10개 고정)
 */
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

/**
 * 더미 캠페인 목록 (9개)
 */
export const DUMMY_CAMPAIGNS: Campaign[] = [
  {
    id: 'campaign-1',
    title: 'Django 완벽 가이드',
    content: 'Python으로 백엔드 API 개발 마스터하기',
    image: '/img/django.png',
    url: 'https://inflearn.com/course/django-rest',
    tags: [
      { id: 2, name: 'TypeScript' },
      { id: 6, name: 'NestJS' },
    ],
    min_price: 200,
    max_price: 550,
  },
  {
    id: 'campaign-2',
    title: 'React 마스터 클래스',
    content: 'React와 TypeScript로 현대적인 웹 개발',
    image: '/img/react.png',
    url: 'https://inflearn.com/course/react-master',
    tags: [
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'TypeScript' },
      { id: 3, name: 'React' },
    ],
    min_price: 150,
    max_price: 480,
  },
  {
    id: 'campaign-3',
    title: '풀스택 개발자 로드맵',
    content: 'React와 Backend를 함께 배우는 과정',
    image: '/img/fullstack.png',
    url: 'https://inflearn.com/course/fullstack',
    tags: [
      { id: 3, name: 'React' },
      { id: 6, name: 'NestJS' },
    ],
    min_price: 100,
    max_price: 700,
  },
  {
    id: 'campaign-4',
    title: 'NestJS 백엔드 완성',
    content: 'TypeScript로 확장 가능한 서버 구축',
    image: '/img/nestjs.png',
    url: 'https://inflearn.com/course/nestjs-backend',
    tags: [
      { id: 2, name: 'TypeScript' },
      { id: 6, name: 'NestJS' },
      { id: 7, name: 'SQL' },
    ],
    min_price: 180,
    max_price: 520,
  },
  {
    id: 'campaign-5',
    title: 'AWS 클라우드 입문',
    content: 'AWS로 배포부터 운영까지',
    image: '/img/aws.png',
    url: 'https://inflearn.com/course/aws-cloud',
    tags: [
      { id: 8, name: 'AWS' },
      { id: 9, name: 'Redis' },
    ],
    min_price: 120,
    max_price: 450,
  },
  {
    id: 'campaign-6',
    title: 'Spring Boot 실전',
    content: 'Java Spring으로 엔터프라이즈 애플리케이션 개발',
    image: '/img/spring.png',
    url: 'https://inflearn.com/course/spring-boot',
    tags: [
      { id: 5, name: 'Spring' },
      { id: 7, name: 'SQL' },
    ],
    min_price: 200,
    max_price: 600,
  },
  {
    id: 'campaign-7',
    title: 'NextJS 14 마스터',
    content: '최신 NextJS로 풀스택 애플리케이션 구축',
    image: '/img/nextjs.png',
    url: 'https://inflearn.com/course/nextjs-14',
    tags: [
      { id: 2, name: 'TypeScript' },
      { id: 3, name: 'React' },
      { id: 4, name: 'NextJS' },
    ],
    min_price: 150,
    max_price: 580,
  },
  {
    id: 'campaign-8',
    title: 'AI 프롬프트 엔지니어링',
    content: 'ChatGPT와 LLM 활용 실전 가이드',
    image: '/img/ai.png',
    url: 'https://inflearn.com/course/ai-prompt',
    tags: [
      { id: 10, name: 'AI' },
      { id: 1, name: 'JavaScript' },
    ],
    min_price: 100,
    max_price: 400,
  },
  {
    id: 'campaign-9',
    title: 'Redis 캐싱 전략',
    content: 'Redis로 성능 최적화하기',
    image: '/img/redis.png',
    url: 'https://inflearn.com/course/redis-caching',
    tags: [
      { id: 9, name: 'Redis' },
      { id: 7, name: 'SQL' },
    ],
    min_price: 130,
    max_price: 420,
  },
];

/**
 * 더미 블로그 포스트
 */
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

/**
 * 더미 클릭 로그
 */
export const DUMMY_CLICK_LOGS: ClickLog[] = [
  {
    timestamp: '14:23',
    campaignId: 'campaign-1',
    campaignName: 'Django 완벽 가이드',
    url: 'https://inflearn.com/course/django-rest?utm_source=quantad',
  },
  {
    timestamp: '14:20',
    campaignId: 'campaign-2',
    campaignName: 'React 마스터 클래스',
    url: 'https://inflearn.com/course/react-master?utm_source=quantad',
  },
  {
    timestamp: '14:18',
    campaignId: 'campaign-8',
    campaignName: 'AI 프롬프트 엔지니어링',
    url: 'https://inflearn.com/course/ai-prompt?utm_source=quantad',
  },
];
