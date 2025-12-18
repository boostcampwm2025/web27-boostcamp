import type { Tag } from '@/shared/types/common';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
}

export const TagSelector = ({ availableTags, selectedTags, onTagToggle }: TagSelectorProps) => {
  const isSelected = (tag: Tag) => selectedTags.some((t) => t.id === tag.id);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-neutral-700 mb-3">태그 수정하기:</h3>
      <div className="grid grid-cols-2 gap-3">
        {availableTags.map((tag) => {
          const selected = isSelected(tag);
          return (
            <label
              key={tag.id}
              className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-colors ${
                selected
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onTagToggle(tag)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium">{tag.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
