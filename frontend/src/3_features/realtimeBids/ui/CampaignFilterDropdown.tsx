import { useState, useRef, useEffect } from 'react';
import { useCampaignList, type Campaign } from '../lib/useCampaignList';

interface CampaignFilterDropdownProps {
  selectedCampaignIds: number[];
  onApply: (campaignIds: number[]) => void;
}

export function CampaignFilterDropdown({
  selectedCampaignIds,
  onApply,
}: CampaignFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] =
    useState<number[]>(selectedCampaignIds);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: campaigns, isLoading } = useCampaignList();

  useEffect(() => {
    setTempSelected(selectedCampaignIds);
  }, [selectedCampaignIds]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setTempSelected(selectedCampaignIds);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCampaignIds]);

  const handleToggle = (campaignId: number) => {
    setTempSelected((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (tempSelected.length === campaigns?.length) {
      setTempSelected([]);
    } else {
      setTempSelected(campaigns?.map((c) => parseInt(c.id, 10)) || []);
    }
  };

  const handleApply = () => {
    onApply(tempSelected);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempSelected([]);
    onApply([]);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedCampaignIds.length === 0) {
      return '전체';
    }
    if (selectedCampaignIds.length === 1) {
      const campaign = campaigns?.find(
        (c) => parseInt(c.id, 10) === selectedCampaignIds[0]
      );
      return campaign?.title || '전체';
    }
    return `${selectedCampaignIds.length}개 선택됨`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
        disabled={isLoading}
      >
        <span className="text-xs text-blue-600 font-normal">
          {getDisplayText()}
        </span>
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                캠페인 필터
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                초기화
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  tempSelected.length === campaigns?.length &&
                  campaigns?.length > 0
                }
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">전체 선택</span>
            </label>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">로딩 중...</div>
            ) : campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <label
                  key={campaign.id}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(parseInt(campaign.id, 10))}
                    onChange={() => handleToggle(parseInt(campaign.id, 10))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {campaign.title}
                  </span>
                </label>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                캠페인이 없습니다
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 flex gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setTempSelected(selectedCampaignIds);
              }}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
