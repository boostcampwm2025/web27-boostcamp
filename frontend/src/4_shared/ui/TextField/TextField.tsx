import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function TextField({ label, error, id, className, ...rest }: Props) {
  const inputId = id ?? rest.name;
  const isDisabled = rest.disabled;
  return (
    <div className="flex flex-col gap-3">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-bold text-[#111318]">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`h-11 rounded-lg border px-3 outline-none ${
          error
            ? 'border-red-300 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 focus:ring-2 focus:ring-blue-200'
        } ${
          isDisabled
            ? 'bg-gray-100 text-gray-400 placeholder:text-gray-300 cursor-not-allowed'
            : ''
        } ${className ?? ''}`}
        {...rest}
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
