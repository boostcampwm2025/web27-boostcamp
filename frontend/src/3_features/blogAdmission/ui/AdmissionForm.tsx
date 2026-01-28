import { TextField } from '@/4_shared/ui/TextField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSubmit } from '../lib/handleSubmit';

export function AdmissionForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <form
        onSubmit={async (e) => {
          try {
            await handleSubmit(e);
            setError(null);
            navigate('/publisher/onboarding/sdk-guide');
          } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : '알 수 없는 오류가 발생했습니다.';
            setError(message);
          }
        }}
        className="flex flex-col gap-6 mt-15 mx-10"
      >
        <div className="flex flex-col gap-1">
          <p className="text-4xl font-extrabold">블로그 등록</p>
          <p className="text-base text-[#616E89] font-normal">
            블로그를 등록하고 지금 시작하세요.
          </p>
        </div>
        <TextField
          name="blogName"
          type="text"
          label="블로그 이름"
          placeholder="나의 블로그"
        />
        <TextField
          name="blogUrl"
          type="text"
          inputMode="url"
          label="블로그 URL"
          placeholder="myblog.tistory.com"
        />
        <button
          type="submit"
          className="h-11 rounded-lg bg-blue-500 text-base font-semibold text-white hover:bg-blue-600"
        >
          시작하기
        </button>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </form>
    </div>
  );
}
