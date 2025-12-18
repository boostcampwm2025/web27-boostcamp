import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  highlight?: boolean;
}

export const Card = ({
  highlight = false,
  className = '',
  children,
  ...props
}: CardProps) => {
  const baseClasses =
    'bg-white rounded-lg border shadow-sm p-6 transition-shadow hover:shadow-md';
  const highlightClasses = highlight
    ? 'border-success-500 border-l-4 bg-success-100'
    : 'border-neutral-200';

  return (
    <div
      className={`${baseClasses} ${highlightClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
