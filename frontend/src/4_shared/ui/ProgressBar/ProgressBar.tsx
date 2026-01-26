type ColorScheme = 'auto' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';

interface ProgressBarProps {
  percentage: number;
  colorScheme?: ColorScheme;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const COLOR_CLASSES = {
  blue: { bar: 'bg-blue-500', text: 'text-blue-500' },
  green: { bar: 'bg-green-500', text: 'text-green-500' },
  yellow: { bar: 'bg-yellow-500', text: 'text-yellow-500' },
  red: { bar: 'bg-red-700', text: 'text-red-700' },
  gray: { bar: 'bg-gray-500', text: 'text-gray-500' },
} as const;

const SIZE_CLASSES = {
  sm: 'h-2',
  md: 'h-3',
} as const;

function getAutoColor(percentage: number): keyof typeof COLOR_CLASSES {
  if (percentage >= 80) return 'red';
  if (percentage >= 50) return 'yellow';
  return 'blue';
}

export function ProgressBar({
  percentage,
  colorScheme = 'auto',
  showLabel = true,
  size = 'sm',
}: ProgressBarProps) {
  const colorKey = colorScheme === 'auto' ? getAutoColor(percentage) : colorScheme;
  const colors = COLOR_CLASSES[colorKey];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <div className={`w-32 ${sizeClass} bg-gray-200 rounded-full overflow-hidden shrink-0`}>
        <div
          className={`h-full rounded-full ${colors.bar}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-sm font-medium ${colors.text}`}>
          {percentage}%
        </span>
      )}
    </div>
  );
}
