import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { AccountType } from '@features/onboard/model/types';
import { Icon } from '@shared/ui/Icon';

interface UserTypeSelectorProps {
  value?: AccountType;
  onChange?: (accountType: AccountType) => void;
  name?: string;
}

export function UserTypeSelector(props: UserTypeSelectorProps) {
  const { value, onChange, name = 'accountType' } = props;
  const [internalValue, setInternalValue] = useState<AccountType>('advertiser');
  const selectedValue = value ?? internalValue;

  const handleChange = (nextValue: AccountType) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <div className="flex flex-col gap-4">
      <p
        id="accountTypeLabel"
        className="text-sm font-semibold tracking-tight text-slate-800"
      >
        계정 유형
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label
          className="group relative cursor-pointer"
          style={
            {
              '--role-accent': '#2563EB',
              '--role-accent-soft': 'rgba(37, 99, 235, 0.18)',
            } as CSSProperties
          }
        >
          <input
            type="radio"
            name={name}
            value="advertiser"
            checked={selectedValue === 'advertiser'}
            onChange={() => handleChange('advertiser')}
            className="sr-only peer"
          />
          <div className="relative flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 peer-checked:border-[var(--role-accent)]">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition peer-checked:bg-[var(--role-accent)] peer-checked:text-white">
                <Icon.LoudSpeaker className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                advertiser
              </span>
            </div>

            <div>
              <div className="text-lg font-semibold text-slate-900">광고주</div>
              <p className="mt-1 text-sm text-slate-500">
                캠페인을 만들고 성과를 분석해요
              </p>
            </div>
          </div>
        </label>

        <label
          className="group relative cursor-pointer"
          style={
            {
              '--role-accent': '#059669',
              '--role-accent-soft': 'rgba(5, 150, 105, 0.18)',
            } as CSSProperties
          }
        >
          <input
            type="radio"
            name={name}
            value="publisher"
            checked={selectedValue === 'publisher'}
            onChange={() => handleChange('publisher')}
            className="sr-only peer"
          />
          <div className="relative flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 peer-checked:border-[var(--role-accent)]">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition peer-checked:bg-[var(--role-accent)] peer-checked:text-white">
                <Icon.Pen className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                publisher
              </span>
            </div>

            <div>
              <div className="text-lg font-semibold text-slate-900">
                퍼블리셔
              </div>
              <p className="mt-1 text-sm text-slate-500">
                블로그 수익화를 위한 도구를 제공해요
              </p>
            </div>

          </div>
        </label>
      </div>
    </div>
  );
}
