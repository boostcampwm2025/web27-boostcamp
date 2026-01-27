export const MAIN_NAV_ITEMS = [
  { label: '솔루션', href: '#solution' },
  { label: '개발자', href: '#developer' },
  { label: '가격', href: '#pricing' },
  {
    label: '공지사항',
    href: 'https://github.com/boostcampwm2025/web27-BoostAD',
  },
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
    description: '페이지의 핵심 키워드·주제를 추출해 의도를 정확히 파악합니다.',
    icon: 'Terminal',
  },
  {
    title: '의도 매칭',
    description: '오디언스가 지금 찾는 정보와 가장 가까운 광고를 연결합니다.',
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

export type HighIntentStepIcon = 'Copy' | 'Eye' | 'Clock' | 'Click';

export const HIGH_INTENT_STEPS = [
  {
    title: '코드 복사 (Copy)',
    description: '단순 방문을 넘어, 실제 코드 사용 의도가 있는 핵심 오디언스를 식별합니다.',
    icon: 'Copy',
    stat: '3.5x',
    statLabel: '전환율',
  },
  {
    title: '정독 (Scroll)',
    description: '콘텐츠를 끝까지 읽은 깊은 스크롤 행동을 분석해 관심도를 측정합니다.',
    icon: 'Eye',
    stat: '60%',
    statLabel: '완독률',
  },
  {
    title: '긴 체류 시간 (Dwell)',
    description: '문서에 충분히 머무른 시간을 통해 실질적인 학습 의도를 파악합니다.',
    icon: 'Clock',
    stat: '+2m',
    statLabel: '평균 체류',
  },
  {
    title: '참조 클릭 (Link)',
    description: '관련 문서나 레퍼런스로의 이동 패턴으로 적극적인 탐색 의도를 잡아냅니다.',
    icon: 'Click',
    stat: '15%',
    statLabel: 'CTR',
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  icon: HighIntentStepIcon;
  stat: string;
  statLabel: string;
}>;

export const MAIN_LOG_ROWS = [
  {
    time: '11:29:41',
    campaign: 'NestJS 완벽 가이드',
    postUrl: '/blog/nestjs-architecture',
    myBid: '1,500원',
    winningPrice: '1,500원',
    insight: '고의도 학습자',
    result: '낙찰',
  },
  {
    time: '11:30:03',
    campaign: 'React 실전 프로젝트',
    postUrl: '/questions/react-hooks-error',
    myBid: '1,200원',
    winningPrice: '1,800원',
    insight: '모든 학습자',
    result: '탈락',
  },
  {
    time: '11:30:22',
    campaign: 'CS 전공 지식 레벨업',
    postUrl: '/interview/operating-system',
    myBid: '2,000원',
    winningPrice: '1,950원',
    insight: '고의도 학습자',
    result: '낙찰',
  },
  {
    time: '11:30:45',
    campaign: '코딩테스트 합격 패키지',
    postUrl: '/problems/dynamic-programming',
    myBid: '800원',
    winningPrice: '1,100원',
    insight: '모든 학습자',
    result: '탈락',
  },
  {
    time: '11:31:10',
    campaign: '프론트엔드 성능 최적화',
    postUrl: '/docs/web-vitals',
    myBid: '1,800원',
    winningPrice: '1,800원',
    insight: '고의도 학습자',
    result: '낙찰',
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
