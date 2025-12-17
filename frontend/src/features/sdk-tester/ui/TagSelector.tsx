import { AVAILABLE_TAGS, type Tag } from '@/shared/config/constants';

interface TagSelectorProps {
  selectedTags: Tag[];
  onToggleTag: (tag: Tag) => void;
  sdkLoaded: boolean;
  sdkError: string | null;
}

// 태그 선택 UI (SDK 테스트용 - MVP에서 삭제 예정)
export default function TagSelector({
  selectedTags,
  onToggleTag,
  sdkLoaded,
  sdkError,
}: TagSelectorProps) {
  return (
    <div className="bg-amber-100 border-b border-amber-300">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">
            🏷️ 태그 선택 (SDK 테스트용)
          </h2>
          <span className="text-xs text-gray-600">
            {selectedTags.length}개 선택됨
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {AVAILABLE_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <label
                key={tag}
                className={`
                  flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all
                  ${
                    isSelected
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleTag(tag)}
                  className="w-4 h-4 mr-2 accent-indigo-600 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900">{tag}</span>
              </label>
            );
          })}
        </div>

        {sdkError && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-sm text-red-800">❌ {sdkError}</p>
          </div>
        )}

        {sdkLoaded && (
          <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ SDK 로드 완료! (브라우저 콘솔 F12에서 로그 확인)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
