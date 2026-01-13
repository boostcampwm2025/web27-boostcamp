import { TextField } from '@shared/ui/TextField/TextField';
import { useState } from 'react';

type AccountType = 'advertiser' | 'publisher';

export function RegisterForm() {
  const [accountType, setAccountType] = useState<AccountType>('advertiser');

  return (
    <form className="flex flex-col gap-6 mt-15 mx-10">
      <div className="flex flex-col gap-1">
        <p className="text-4xl font-extrabold">회원가입</p>
        <p className="text-base text-[#616E89] font-normal">
          광고주 또는 퍼블리셔로 가입하세요.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <p
            id="accountTypeLabel"
            className="text-sm font-semibold text-[#111318]"
          >
            계정 유형
          </p>
          <div className="grid grid-cols-2 gap-4">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="accountType"
                value="advertiser"
                checked={accountType === 'advertiser'}
                onChange={() => setAccountType('advertiser')}
                className="sr-only peer"
              />
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 px-4 py-5 text-center peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-200">
                <div className="text-xl font-extrabold text-gray-900">
                  광고주
                </div>
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
                checked={accountType === 'publisher'}
                onChange={() => setAccountType('publisher')}
                className="sr-only peer"
              />
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 px-4 py-5 text-center peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-200">
                <div className="text-xl font-extrabold text-gray-900">
                  퍼블리셔
                </div>
                <div className="mt-2 text-sm font-normal text-[#616E89]">
                  블로그로 수익을 창출하고 싶어요
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        <TextField
          name="email"
          type="email"
          label="이메일"
          placeholder="exmaple@email.com"
        />
        <TextField
          name="password"
          type="password"
          label="비밀번호"
          placeholder="••••••••"
        />
        <TextField
          name="passwordConfirm"
          type="password"
          label="비밀번호 확인"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="h-11 rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
      >
        회원가입
      </button>
    </form>
  );
}
