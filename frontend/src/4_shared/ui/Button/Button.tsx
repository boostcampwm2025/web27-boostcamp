import type { ReactNode } from 'react';

type ButtonVariant = 'blue' | 'white';
type ButtonSize = 'xs' | 'sm' | 'base';
type IconPosition = 'left' | 'right';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  variant = 'blue',
  size = 'base',
  icon,
  iconPosition = 'right',
  onClick,
  children,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'flex flex-row items-center gap-1.5 py-2 px-4 rounded-lg font-medium cursor-pointer transition-colors';

  const variantStyles = {
    blue: 'bg-blue-500 text-white hover:bg-blue-600',
    white: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
  };

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`}
    >
      {icon && iconPosition === 'left' ? icon : null}
      <span>{children}</span>
      {icon && iconPosition === 'right' ? icon : null}
    </button>
  );
}
