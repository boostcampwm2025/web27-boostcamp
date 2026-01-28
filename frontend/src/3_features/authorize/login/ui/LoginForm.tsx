import { FormDivider } from '@/4_shared/ui/Divider';
import { Icon } from '@/4_shared/ui/Icon';
import { TextField } from '@shared/ui/TextField';
import { useCallback } from 'react';
import { handleLogin } from '../../lib/handleOauth';

export function LoginForm() {
  const onClick = useCallback(() => {
    handleLogin();
  },[]);

  return (
    <form className="flex flex-col gap-6 mt-15 mx-10">
      <div className="flex flex-col gap-1">
        <p className="text-4xl font-extrabold">로그인</p>
        <p className="text-base text-[#616E89] font-normal">
          광고주 또는 퍼블리셔 계정으로 로그인하세요.
        </p>
      </div>
      <button
        type="button"
        className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-base font-semibold text-[#111318] hover:bg-gray-50"
        onClick={() => onClick()}
      >
        <Icon.Google />
        <span className="cursor-default">Google로 계속하기</span>
      </button>

      <FormDivider />

      <div className="rounded-md text-center py-2 text-sm text-[#7A8699]">
        로컬 로그인은 준비 중입니다. 현재는 Google 로그인만 가능합니다.
      </div>

      <TextField
        name="email"
        type="email"
        label="이메일"
        placeholder="example@email.com"
        disabled
      />
      <TextField
        name="password"
        type="password"
        label="비밀번호"
        placeholder="••••••••"
        disabled
      />
      <button
        type="submit"
        disabled={true}
        className="h-11 rounded-lg bg-blue-500 text-base font-semibold text-white hover:bg-blue-600 cursor-not-allowed"
      >
        로그인
      </button>
    </form>
  );
}
