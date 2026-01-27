export const MAIN_NAV_ITEMS = [
  { label: '솔루션', href: '#solution' },
  { label: '개발자', href: '#developer' },
  { label: '가격', href: '#pricing' },
  { label: '블로그', href: '#blog' },
] as const;

export type MainFeatureStepIcon = 'Stop2' | 'Terminal' | 'ClickLine' | 'Dollar';

export const MAIN_FEATURE_STEPS = [
  {
    title: '서드파티 쿠키 없이',
    description:
      '추적 기반 타게팅 대신 콘텐츠 문맥을 이해해 광고를 매칭합니다.',
    icon: 'Stop2',
  },
  {
    title: '맥락 분석',
    description:
      '페이지의 핵심 키워드·주제를 추출해 의도를 정확히 파악합니다.',
    icon: 'Terminal',
  },
  {
    title: '의도 매칭',
    description:
      '오디언스가 지금 찾는 정보와 가장 가까운 광고를 연결합니다.',
    icon: 'ClickLine',
  },
  {
    title: '수익 최적화',
    description:
      '실시간 경매 로그로 성과를 확인하고 수익화를 빠르게 반복합니다.',
    icon: 'Dollar',
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  icon: MainFeatureStepIcon;
}>;

export const MAIN_LOG_ROWS = [
  {
    time: '14:32:41',
    page: '/docs/react-hooks',
    keyword: 'useEffect',
    bid: '$14.50 CPM',
    result: '+24%',
  },
  {
    time: '14:32:45',
    page: '/blog/vite-migration',
    keyword: 'Vite',
    bid: '$11.20 CPM',
    result: '+18%',
  },
  {
    time: '14:32:50',
    page: '/docs/tailwind-v4',
    keyword: 'Tailwind CSS',
    bid: '$9.80 CPM',
    result: '+12%',
  },
  {
    time: '14:32:55',
    page: '/docs/privacy',
    keyword: 'Privacy',
    bid: '$13.10 CPM',
    result: '+21%',
  },
] as const;

export const MAIN_MONETIZE_POINTS = [
  '빠른 설치: 스크립트 1줄로 시작',
  '개발자 경험: 명확한 로그와 디버깅',
  '프라이버시 친화: 쿠키/식별자 최소화',
  '간편 운영: 슬롯 단위로 실험/롤백',
] as const;

export const MAIN_FOOTER_LINK_GROUPS = [
  {
    title: '제품',
    links: ['솔루션', '개발자', '가격', '상태'],
  },
  {
    title: '리소스',
    links: ['문서', '가이드', 'API', '커뮤니티'],
  },
  {
    title: '회사',
    links: ['소개', '채용', '블로그', '문의'],
  },
] as const;
