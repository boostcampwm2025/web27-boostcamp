import { formatWithComma, parseNumber } from '@shared/lib/format';

interface CurrencyFieldProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  hint?: string;
  error?: string;
  placeholder?: string;
  unit?: string;
}

export function CurrencyField({
  label,
  value,
  onChange,
  onBlur,
  hint,
  error,
  placeholder = '0',
  unit = '원',
}: CurrencyFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = parseNumber(e.target.value);
    onChange(numberValue);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-bold text-gray-900">{label}</label>}

      <div
        className={`flex h-11 items-center rounded-lg border px-3 focus-within:ring-2 ${
          error
            ? 'border-red-300 focus-within:ring-red-200'
            : 'border-gray-200 focus-within:ring-blue-200'
        }`}
      >
        <input
          type="text"
          inputMode="numeric"
          value={formatWithComma(value)}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 outline-none"
        />
        <span className="ml-2 text-sm text-gray-500">{unit}</span>
      </div>

      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
