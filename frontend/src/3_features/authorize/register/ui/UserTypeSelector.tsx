import type { AccountType } from './RegisterForm';

interface UserTypeSelectorProps {
  value: AccountType;
  onChange: (accountType: AccountType) => void;
}

export function UserTypeSelector(props: UserTypeSelectorProps) {
  const { value, onChange } = props;
  return (
    <div className="flex flex-col gap-3">
      <p id="accountTypeLabel" className="text-sm font-semibold text-[#111318]">
        계정 유형
      </p>
      <div className="grid grid-cols-2 gap-4">
        <label className="cursor-pointer">
          <input
            type="radio"
            name="accountType"
            value="advertiser"
            checked={value === 'advertiser'}
            onChange={() => onChange('advertiser')}
            className="sr-only peer"
          />
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 px-4 py-5 text-center peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-200">
            <div className="text-xl font-extrabold text-gray-900">광고주</div>
            <div className="mt-2 text-sm font-normal text-[#616E89]">
              광고를 게시하고 싶어요
            </div>
          </div>
        </label>

        <label className="cursor-pointer">
          <input
            type="radio"
            name="accountType"
            value="publisher"
            checked={value === 'publisher'}
            onChange={() => onChange('publisher')}
            className="sr-only peer"
          />
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 px-4 py-5 text-center peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-200">
            <div className="text-xl font-extrabold text-gray-900">퍼블리셔</div>
            <div className="mt-2 text-sm font-normal text-[#616E89]">
              블로그로 수익을 창출하고 싶어요
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}