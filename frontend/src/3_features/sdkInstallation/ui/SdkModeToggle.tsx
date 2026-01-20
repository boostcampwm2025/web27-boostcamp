export type SdkMode = 'auto' | 'manual';

interface SdkModeToggleProps {
  mode: SdkMode;
  onModeChange: (mode: SdkMode) => void;
}

export function SdkModeToggle({ mode, onModeChange }: SdkModeToggleProps) {
  return (
    <div className="flex flex-row p-1 bg-gray-200 rounded-xl">
      <button
        className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
          mode === 'auto' ? 'bg-white text-blue-500' : 'text-gray-500'
        }`}
        onClick={() => onModeChange('auto')}
      >
        자동 모드 (블로그용)
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
          mode === 'manual' ? 'bg-white text-blue-500' : 'text-gray-500'
        }`}
        onClick={() => onModeChange('manual')}
      >
        수동 모드 (웹서비스용)
      </button>
    </div>
  );
}
