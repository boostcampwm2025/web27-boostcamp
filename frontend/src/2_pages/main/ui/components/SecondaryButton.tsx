import type { ReactNode } from 'react';
import { Icon } from '@shared/ui/Icon';

interface SecondaryButtonProps {
  href: string;
  children: ReactNode;
}

export function SecondaryButton({ href, children }: SecondaryButtonProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-gray-200 bg-white px-5 py-3 text-[15px] font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
    >
      {children}
      <Icon.ArrowRight className="h-4 w-4 text-gray-500" />
    </a>
  );
}
