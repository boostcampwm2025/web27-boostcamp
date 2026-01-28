import type { TextareaHTMLAttributes } from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function TextArea({ label, error, id, className, ...rest }: Props) {
  const textareaId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-3">
      {label ? (
        <label htmlFor={textareaId} className="text-sm font-bold text-[#111318]">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        className={`min-h-20 rounded-lg border px-3 py-2 outline-none resize-none ${
          error
            ? 'border-red-300 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 focus:ring-2 focus:ring-blue-200'
        } ${className ?? ''}`}
        {...rest}
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
