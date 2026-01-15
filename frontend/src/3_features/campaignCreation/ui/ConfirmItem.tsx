interface ConfirmItemProps {
  label: string;
  value: string;
  isLink?: boolean;
}

export function ConfirmItem({ label, value, isLink = false }: ConfirmItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-sm ${isLink ? 'break-all text-blue-500' : 'text-gray-900'}`}
      >
        {value}
      </span>
    </div>
  );
}
