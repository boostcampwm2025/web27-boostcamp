interface BudgetProgressBarProps {
  percentage: number;
}

export function BudgetProgressBar({ percentage }: BudgetProgressBarProps) {
  const getColor = () => {
    if (percentage >= 80) return 'red-700';
    if (percentage >= 50) return 'yellow-500';
    return 'blue-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-${getColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={`text-sm font-medium text-${getColor()}`}>
        {percentage}%
      </span>
    </div>
  );
}
