import { Modal } from '@shared/ui/Modal';
import { DiagonalBannersBackground } from '@shared/ui/Background';
import { RegisterForm } from '@features/authorize/register/ui/RegisterForm';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@shared/lib/hooks';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@shared/lib/toast';

const AUTH_BG: 'banners' | 'lines' | 'none' = 'banners'; // 쉽게 제거/비활성화 가능

export function RegisterPage() {
  useDocumentTitle('회원가입');
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'not_found') {
      showToast('등록되지 않은 계정입니다. 회원가입해주세요', 'info');
      // URL에서 쿼리 파라미터 제거
      searchParams.delete('reason');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, showToast]);

  return (
    <div className="relative flex min-h-screen w-full items-start justify-center bg-[#F6F6F8] overflow-hidden pt-25">
      {AUTH_BG === 'banners' ? <DiagonalBannersBackground /> : null}
      <div className="relative z-10">
        <Modal height="h-[535px]">
          <div className="flex flex-col gap-3">
            <RegisterForm />
            <div className="flex items-center justify-center text-sm gap-1 ">
              <p className="text-[#616E89]">이미 계정이 있나요?</p>
              <Link
                to={'/auth/login'}
                className="text-blue-500 hover:underline"
              >
                로그인
              </Link>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
