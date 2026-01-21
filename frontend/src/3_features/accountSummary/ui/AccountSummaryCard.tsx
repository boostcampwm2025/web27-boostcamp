import { Icon } from '@shared/ui/Icon';

interface AccountSummaryCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

export function AccountSummaryCard({ title, value, change, icon }: AccountSummaryCardProps) {
  return (
    <div className="flex-1 min-w-65 p-5 bg-white border border-gray-200 rounded-xl shadow">
      <div className="flex flex-row items-center justify-between text-gray-600">
        <span className="text-base font-semibold">{title}</span>
        {icon && <span>{icon}</span>}
      </div>
      <div className="flex flex-row items-baseline gap-4 pt-4">
        <div className="text-4xl font-bold text-gray-900">{value}</div>
        {change && (
          <div className="flex flex-row items-center gap-1 px-1.5 py-0.5 bg-green-100 border border-green-300 rounded-lg text-xs font-semibold text-green-500">
            <Icon.ArrowUp className="w-2.5 text-green-500" />
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
