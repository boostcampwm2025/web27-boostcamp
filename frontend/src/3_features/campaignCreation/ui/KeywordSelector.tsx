import { useState } from 'react';
import { Icon } from '@shared/ui/Icon';
import type { Tag, CampaignCategory } from '../lib/types';
import {
  CAMPAIGN_CATEGORIES,
  getTagsByCategory,
  MAX_SELECTED_TAGS,
} from '../lib/constants';

interface KeywordSelectorProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  error?: string;
}

export function KeywordSelector({
  value,
  onChange,
  error,
}: KeywordSelectorProps) {
  const [activeCategory, setActiveCategory] =
    useState<CampaignCategory>('언어');

  const selectedTagIds = value.map((tag) => tag.id);

  const isTagSelected = (tagId: number) => {
    return selectedTagIds.includes(tagId);
  };

  const handleSelectTag = (tag: Tag) => {
    if (value.length >= MAX_SELECTED_TAGS) {
      return;
    }
    if (isTagSelected(tag.id)) {
      return;
    }
    onChange([...value, tag]);
  };

  const handleRemoveTag = (tagId: number) => {
    const filteredTags = value.filter((tag) => tag.id !== tagId);
    onChange(filteredTags);
  };

  const categoryTags = getTagsByCategory(activeCategory);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-gray-900">키워드</label>

      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4">
        {/* 선택된 태그 */}
        <div className="flex min-h-10 flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
          {value.length === 0 ? (
            <span className="text-sm text-gray-400">
              키워드를 선택해주세요 (최대 {MAX_SELECTED_TAGS}개)
            </span>
          ) : (
            value.map((tag) => (
              <span
                key={tag.id}
                className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-sm text-gray-700"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="flex h-4 w-4 cursor-pointer items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  <Icon.Close className="h-3 w-3" />
                </button>
                {tag.name}
              </span>
            ))
          )}
        </div>

        {/* 탭 */}
        <div className="flex flex-wrap gap-1 border-b border-gray-200">
          {CAMPAIGN_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 태그 목록 */}
        <div className="flex flex-wrap gap-2">
          {categoryTags.map((tag) => {
            const selected = isTagSelected(tag.id);
            const disabled = !selected && value.length >= MAX_SELECTED_TAGS;

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleSelectTag(tag)}
                disabled={disabled || selected}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? 'cursor-default border-blue-500 bg-blue-50 text-blue-500'
                    : disabled
                      ? 'cursor-not-allowed border-gray-200 text-gray-300'
                      : 'cursor-pointer border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800'
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
