export type RoleType = 'advertiser' | 'publisher';

interface Props {
  value: RoleType;
  onChange: (value: RoleType) => void;
}

export function RoleToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-center p-1 rounded-full bg-gray-100 border border-gray-200">
      <button
        onClick={() => onChange('advertiser')}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          value === 'advertiser'
            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        광고주 (Advertiser)
      </button>
      <button
        onClick={() => onChange('publisher')}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          value === 'publisher'
            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        퍼블리셔 (Publisher)
      </button>
    </div>
  );
}
