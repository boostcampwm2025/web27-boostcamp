import { TextField } from '@/4_shared/ui/TextField/TextField';

export function LoginForm() {
  return (
    <form className="flex flex-col gap-6 mt-15 mx-10">
      <div className="flex flex-col gap-1">
        <p className="text-4xl font-extrabold">로그인</p>
        <p className="text-base text-[#616E89] font-normal">
          광고주 또는 퍼블리셔 계정으로 로그인하세요.
        </p>
      </div>
      <TextField
        name="email"
        type="email"
        label="이메일"
        placeholder="example@email.com"
      />
      <TextField
        name="password"
        type="password"
        label="비밀번호"
        placeholder="••••••••"
      />
      <button
        type="submit"
        className="h-11 rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
      >
        로그인
      </button>
    </form>
  );
}
