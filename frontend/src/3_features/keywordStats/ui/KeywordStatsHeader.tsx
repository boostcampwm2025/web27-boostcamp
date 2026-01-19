import { useState, useRef, useEffect } from 'react';
import type { SortKey } from '../lib/types';
import { Icon } from '@shared/ui/Icon';

interface KeywordStatsHeaderProps {
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'avgCtr', label: 'CTR순' },
  { key: 'avgClicks', label: '클릭수순' },
  { key: 'avgImpressions', label: '노출수순' },
];

export function KeywordStatsHeader({
  sortKey,
  onSortChange,
}: KeywordStatsHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫는 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (key: SortKey) => {
    onSortChange(key);
    setIsMenuOpen(false);
  };

  return (
    <div className="p-5 flex flex-row justify-between items-center border-b border-gray-100">
      <h2 className="text-gray-900 text-xl font-bold">키워드 성과</h2>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 hover:bg-gray-100 rounded-lg"
        >
          <Icon.More className="w-5 h-5 text-gray-500" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-30">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSortSelect(option.key)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                  sortKey === option.key
                    ? 'text-blue-500 font-semibold'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
