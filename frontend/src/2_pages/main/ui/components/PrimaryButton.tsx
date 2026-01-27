import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@shared/ui/Icon';

interface PrimaryButtonProps {
  to: string;
  children: ReactNode;
}

export function PrimaryButton({ to, children }: PrimaryButtonProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-blue-500 px-5 py-3 text-[15px] font-semibold text-white shadow-[0px_10px_15px_rgba(37,99,235,0.18),0px_4px_6px_rgba(37,99,235,0.18)] transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
    >
      {children}
      <Icon.ArrowRight className="h-4 w-4" />
    </Link>
  );
}
