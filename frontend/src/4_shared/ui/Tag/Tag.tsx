import type { ReactNode } from 'react';

type TagVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  icon?: ReactNode;
  className?: string;
}

const VARIANT_STYLES = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-blue-50 text-blue-500 border-blue-200',
  success: 'bg-green-50 text-green-600 border-green-200',
  warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  danger: 'bg-red-50 text-red-600 border-red-200',
  info: 'bg-purple-50 text-purple-600 border-purple-200',
} as const;

export function Tag({
  children,
  variant = 'default',
  icon,
  className = '',
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm ${VARIANT_STYLES[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
