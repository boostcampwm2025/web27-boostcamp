import { Icon } from '@shared/ui/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const isZeroChange = change && parseFloat(change) === 0;
  const isPositiveChange = change && !change.startsWith('-');

  return (
    <div className="flex-1 min-w-65 p-5 bg-white border border-gray-200 rounded-xl shadow">
      <div className="flex flex-row items-center justify-between text-gray-600">
        <span className="text-base font-semibold">{title}</span>
        {icon && <span>{icon}</span>}
      </div>
      <div className="flex flex-row items-baseline gap-4 pt-4">
        <div className="text-4xl font-bold text-gray-900">{value}</div>
        {change && !isZeroChange && (
          <div
            className={`flex flex-row items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-semibold ${
              isPositiveChange
                ? 'bg-green-100 border border-green-300 text-green-500'
                : 'bg-red-100 border border-red-500 text-red-700'
            }`}
          >
            {isPositiveChange ? (
              <Icon.ArrowUp className="w-2.5 text-green-500" />
            ) : (
              <Icon.ArrowDown className="w-2.5 text-red-700" />
            )}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
