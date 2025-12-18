import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/shared/ui/Header/Header';
import { BlogSection } from './BlogSection';
import { DebugSection } from './DebugSection';
import { AVAILABLE_TAGS, DUMMY_POST } from '@/shared/config/constants';
import { getClickLogs } from '@/shared/api/clickApi';
import type { Tag, MatchedCampaign, ClickLog } from '@/shared/types/common';

export const DemoPage = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(DUMMY_POST.autoTags);
  const [adCampaign, setAdCampaign] = useState<MatchedCampaign | null>(null);
  const [candidates, setCandidates] = useState<MatchedCampaign[]>([]);
  const [clickLogs, setClickLogs] = useState<ClickLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Decision API: 태그 변경 시 광고 가져오기
  useEffect(() => {
    const fetchDecision = async () => {
      if (!window.DevAd || selectedTags.length === 0) return;

      try {
        const result = await window.DevAd.fetchDecision(
          selectedTags,
          window.location.href
        );

        setAdCampaign(result.winner);
        setCandidates(result.candidates);
      } catch (error) {
        console.error('Failed to fetch decision:', error);
      }
    };

    fetchDecision();
  }, [selectedTags]);

  // 클릭 로그 가져오기
  const fetchClickLogs = useCallback(async () => {
    if (!window.DevAd) return;

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
            candidates={candidates}
            clickLogs={clickLogs}
            isLoadingLogs={isLoadingLogs}
          />
        </div>
      </main>
    </div>
  );
};
