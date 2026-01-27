import { useState, useRef, useEffect } from 'react';
import { useCampaignList } from '../lib/useCampaignList';

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

  const handleApply = () => {
    onApply(tempSelected);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempSelected([]);
    onApply([]);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-0.5 hover:bg-gray-200 rounded transition-colors"
        disabled={isLoading}
        title="캠페인 필터"
      >
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
        <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">
              캠페인 필터
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              초기화
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">로딩 중...</div>
            ) : campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <label
                  key={campaign.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(parseInt(campaign.id, 10))}
                    onChange={() => handleToggle(parseInt(campaign.id, 10))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-700 flex-1 truncate">
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

          <div className="p-2.5 border-t border-gray-200 flex gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setTempSelected(selectedCampaignIds);
              }}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors font-medium"
            >
              취소
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium shadow-sm"
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
