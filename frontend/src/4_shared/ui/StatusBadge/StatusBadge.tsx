import { Icon } from '@shared/ui/Icon';

export type CampaignStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';

interface StatusBadgeProps {
  status: CampaignStatus;
}

const STATUS_CONFIG = {
  ACTIVE: {
    label: '진행중',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    textColor: 'text-green-500',
    iconColor: 'text-green-500',
  },
  PAUSED: {
    label: '일시정지',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    iconColor: 'text-red-700',
  },
  PENDING: {
    label: '대기',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-600',
    iconColor: 'text-yellow-500',
  },
  ENDED: {
    label: '종료',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-500',
    iconColor: 'text-gray-500',
  },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  return (
    <div
      className={`flex flex-row items-center gap-1 px-1.5 py-0.5 ${config.bgColor} border ${config.borderColor} rounded-lg text-xs font-semibold ${config.textColor} w-fit`}
    >
      <Icon.Circle className={`w-3 h-3 ${config.iconColor}`} />
      {config.label}
    </div>
  );
}
