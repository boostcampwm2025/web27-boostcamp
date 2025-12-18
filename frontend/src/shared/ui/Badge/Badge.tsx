import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'sponsored' | 'winner';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary-100 text-primary-700',
  sponsored: 'bg-warning-100 text-warning-800 font-semibold text-xs',
  winner: 'bg-success-100 text-success-600 font-semibold',
};

export const Badge = ({ variant = 'default', className = '', children, ...props }: BadgeProps) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
  const variantClasses = variantStyles[variant];

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </span>
  );
};
