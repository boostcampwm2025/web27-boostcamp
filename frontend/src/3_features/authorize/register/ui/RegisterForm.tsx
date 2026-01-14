import { TextField } from '@shared/ui/TextField';
import { Icon } from '@/4_shared/ui/Icon';
import { FormDivider } from '@/4_shared/ui/Divider';

// import { useState } from 'react';
// import { UserTypeSelector } from './UserTypeSelector';

export type AccountType = 'advertiser' | 'publisher';

export function RegisterForm() {
  // const [accountType, setAccountType] = useState<AccountType>('advertiser');

  return (
    <form className="flex flex-col gap-6 mt-15 mx-10">
      <div className="flex flex-col gap-1">
        <p className="text-4xl font-extrabold">회원가입</p>
        <p className="text-base text-[#616E89] font-normal">
          광고주 또는 퍼블리셔로 가입하세요.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {/* <UserTypeSelector value={accountType} onChange={setAccountType} /> */}

        <a className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-base font-semibold text-[#111318] hover:bg-gray-50">
          <Icon.Google />
          <span>Google로 계속하기</span>
        </a>

        <FormDivider />

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
