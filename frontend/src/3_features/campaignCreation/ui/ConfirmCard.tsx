import type { ReactNode } from 'react';
import { Icon } from '@shared/ui/Icon';

interface ConfirmCardProps {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}

export function ConfirmCard({ title, onEdit, children }: ConfirmCardProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex cursor-pointer items-center gap-1 text-sm text-blue-500"
        >
          <Icon.Pen className="h-4 w-4" />
          <span>수정</span>
        </button>
      </div>
      {children}
    </div>
  );
}
