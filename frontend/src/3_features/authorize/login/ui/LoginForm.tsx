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
        {/* 공지사항 배너 */}
        <div className="w-full rounded-lg border border-gray-200 bg-white overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">공지사항</h3>
          </div>

          {/* 공지 목록 */}
          <div className="divide-y divide-gray-100">
            <div className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                <span className="inline-flex items-center justify-center w-12 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                  이벤트
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  신규 광고주 가입 시 크레딧 10만원 지급
                </p>
                <p className="text-xs text-gray-500">2026.02.01</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                <span className="inline-flex items-center justify-center w-12 px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700">
                  점검
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  2월 6일 오전 2시 - 4시 서버 정기 점검
                </p>
                <p className="text-xs text-gray-500">2026.02.03</p>
              </div>
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
          <Link to={'/auth/register'} className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </form>
  );
}
