import { TextField } from '@/4_shared/ui/TextField';

export function AdmissionForm() {
  return (
    <div>
      <form className="flex flex-col gap-6 mt-15 mx-10">
        <div className="flex flex-col gap-1">
          <p className="text-4xl font-extrabold">블로그 등록</p>
          <p className="text-base text-[#616E89] font-normal">
            블로그를 등록하고 지금 시작하세요.
          </p>
        </div>
        <TextField label="블로그 이름" placeholder="나의 블로그" />
        <TextField
          label="블로그 URL"
          placeholder="https://myblog.tistory.com"
        />
        <button
          type="submit"
          className="h-11 rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
        >
          시작하기
        </button>
      </form>
    </div>
  );
}
