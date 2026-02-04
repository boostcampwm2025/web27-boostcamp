import { Icon } from '@/4_shared/ui/Icon';
import { useCallback } from 'react';
import { handleLogin } from '../../lib/handleOauth';
import { Link } from 'react-router-dom';

export function LoginForm() {
  const onClick = useCallback(() => {
    handleLogin();
  }, []);

  return (
    <form className="flex flex-col gap-6 mt-15 mx-10">
      <div className="flex flex-col gap-1">
        <p className="text-4xl font-extrabold">로그인</p>
        <p className="text-base text-[#616E89] font-normal">
          광고주 또는 퍼블리셔 계정으로 로그인하세요.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {/* 서비스 소개 카드 */}
        <div className="w-full p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
          <p className="text-sm font-bold text-gray-800 mb-2">
            BoostAD로 시작하세요
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-blue-500">•</span>
              <span>
                <span className="font-semibold">광고주:</span> 효율적인 타겟팅
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-purple-500">•</span>
              <span>
                <span className="font-semibold">퍼블리셔:</span> 블로그 수익화
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-base font-semibold text-[#111318] hover:bg-gray-50"
          onClick={() => onClick()}
        >
          <Icon.Google />
          <span className="cursor-default">Google로 계속하기</span>
        </button>

        <div className="flex items-center justify-center gap-1 text-sm -mt-3">
          <p className="text-[#616E89]">계정이 없나요?</p>
          <Link to={'/auth/register'}>회원가입</Link>
        </div>
      </div>
    </form>
  );
}
