import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/shared/ui/Header/Header';
import { BlogSection } from './BlogSection';
import { DebugSection } from './DebugSection';
import { AVAILABLE_TAGS, DUMMY_POST } from '@/shared/config/constants';
import { getClickLogs } from '@/shared/api/clickApi';
import type { Tag, MatchedCampaign, ClickLog } from '@/shared/types/common';

// 더미 후보 캠페인 데이터 (점수 포함)
const DUMMY_CANDIDATES: MatchedCampaign[] = [
  {
    id: 'campaign-6',
    title: 'NestJS 백엔드 완성',
    content: 'TypeScript로 확장 가능한 서버 구축',
    image: '/img/nestjs.png',
    url: 'https://inflearn.com/course/nestjs-backend',
    tags: [
      { id: 2, name: 'TypeScript' },
      { id: 6, name: 'NestJS' },
    ],
    min_price: 180,
    max_price: 520,
    score: 95,
    explain:
      'TypeScript, NestJS 태그가 전달되었고 2개가 매칭되어 350원에 낙찰되었습니다.',
  },
  {
    id: 'campaign-3',
    title: '풀스택 개발자 로드맵',
    content: 'React와 Backend를 함께 배우는 과정',
    image: '/img/fullstack.png',
    url: 'https://inflearn.com/course/fullstack',
    tags: [{ id: 6, name: 'NestJS' }],
    min_price: 100,
    max_price: 700,
    score: 82,
    explain: 'NestJS 태그가 매칭되어 400원에 낙찰되었습니다.',
  },
  {
    id: 'campaign-7',
    title: 'NextJS 14 마스터',
    content: '최신 NextJS로 풀스택 애플리케이션 구축',
    image: '/img/nextjs.png',
    url: 'https://inflearn.com/course/nextjs-14',
    tags: [{ id: 2, name: 'TypeScript' }],
    min_price: 150,
    max_price: 580,
    score: 75,
    explain: 'TypeScript 태그가 매칭되어 365원에 낙찰되었습니다.',
  },
];

export const DemoPage = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(DUMMY_POST.autoTags);
  const [clickLogs, setClickLogs] = useState<ClickLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // 클릭 로그 가져오기
  const fetchClickLogs = useCallback(async () => {
    try {
      setIsLoadingLogs(true);
      const logs = await getClickLogs(10);
      setClickLogs(logs);
    } catch (error) {
      console.error('Failed to fetch click logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  // 컴포넌트 마운트 시 클릭 로그 가져오기
  useEffect(() => {
    fetchClickLogs();
  }, [fetchClickLogs]);

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  // 광고 클릭 후 로그 새로고침
  const handleClickTracked = () => {
    fetchClickLogs();
  };

  const adCampaign = DUMMY_CANDIDATES.length > 0 ? DUMMY_CANDIDATES[0] : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* 2단 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* 왼쪽: 블로그 섹션 */}
          <BlogSection
            post={DUMMY_POST}
            availableTags={AVAILABLE_TAGS}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            adCampaign={adCampaign}
            onClickTracked={handleClickTracked}
          />

          {/* 오른쪽: 디버그 섹션 */}
          <DebugSection
            selectedTags={selectedTags}
            candidates={DUMMY_CANDIDATES}
            clickLogs={clickLogs}
            isLoadingLogs={isLoadingLogs}
          />
        </div>
      </main>
    </div>
  );
};
