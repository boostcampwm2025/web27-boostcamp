import { Icon } from '@shared/ui/Icon';
import { Button } from '@shared/ui/Button';
import { StatusBadge } from '@shared/ui/StatusBadge';
import type { CampaignStatus } from '../lib/types';

interface CampaignDetailHeaderProps {
  title: string;
  status: CampaignStatus;
  onBack: () => void;
  onPause: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isPauseLoading?: boolean;
}

export function CampaignDetailHeader({
  title,
  status,
  onBack,
  onPause,
  onEdit,
  onDelete,
  isPauseLoading = false,
}: CampaignDetailHeaderProps) {
  const canPause = status === 'ACTIVE' || status === 'PAUSED';
  const isActive = status === 'ACTIVE';
  const pauseButtonText = isActive ? '일시정지' : '재개';
  const PauseIcon = isActive ? Icon.Stop2 : Icon.Play;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <Icon.ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center gap-2">
        {canPause && (
          <Button
            variant="white"
            size="sm"
            icon={<PauseIcon className="w-4 h-4" />}
            iconPosition="left"
            onClick={onPause}
            disabled={isPauseLoading}
          >
            {pauseButtonText}
          </Button>
        )}
        <Button
          variant="blue"
          size="sm"
          icon={<Icon.Pen className="w-4 h-4" />}
          iconPosition="left"
          onClick={onEdit}
        >
          수정
        </Button>
        <Button
          variant="red"
          size="sm"
          icon={<Icon.Trash className="w-3 h-3" />}
          iconPosition="left"
          onClick={onDelete}
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
