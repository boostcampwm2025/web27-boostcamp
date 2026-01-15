interface ConfirmItemProps {
  label: string;
  value: string;
  isLink?: boolean;
}

export function ConfirmItem({ label, value, isLink = false }: ConfirmItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-sm text-blue-500 hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm text-gray-900">{value}</span>
      )}
    </div>
  );
}
