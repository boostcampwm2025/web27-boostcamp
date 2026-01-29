import { getToday } from '../lib/step2Validation';

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  hint?: string;
  error?: string;
  min?: string;
  disabled?: boolean;
}

export function DateField({
  label,
  value,
  onChange,
  onBlur,
  hint,
  error,
  min,
  disabled = false,
}: DateFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const minDate = min || getToday();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-900">{label}</label>

      <input
        type="date"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        min={minDate}
        disabled={disabled}
        className={`h-11 rounded-lg border px-3 outline-none focus:ring-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
          value
            ? 'text-gray-900'
            : 'text-gray-400 [&::-webkit-datetime-edit-day-field]:text-gray-400 [&::-webkit-datetime-edit-month-field]:text-gray-400 [&::-webkit-datetime-edit-text]:text-gray-400 [&::-webkit-datetime-edit-year-field]:text-gray-400'
        } ${
          error
            ? 'border-red-300 focus:ring-red-200'
            : 'border-gray-200 focus:ring-blue-200'
        } ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed opacity-60'
            : ''
        }`}
      />

      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
