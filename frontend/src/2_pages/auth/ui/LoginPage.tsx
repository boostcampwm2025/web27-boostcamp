import { Modal } from '@shared/ui/Modal';
import { DiagonalBannersBackground } from '@shared/ui/Background';
import { LoginForm } from '@features/authorize/login/ui/LoginForm';
import { useDocumentTitle } from '@shared/lib/hooks';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@shared/lib/toast';

const AUTH_BG: 'banners' | 'lines' | 'none' = 'banners'; // 쉽게 제거/비활성화 가능

export function LoginPage() {
  useDocumentTitle('로그인');
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'registered') {
      showToast('회원가입이 완료되었습니다. Google로 로그인해주세요', 'info');
      // URL에서 쿼리 파라미터 제거
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('reason');
      setSearchParams(nextParams, { replace: true });
    } else if (reason === 'already_exists') {
      showToast('이미 가입된 계정입니다. 로그인해주세요', 'info');
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('reason');
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams, showToast]);

  return (
    <div className="relative flex min-h-screen w-full items-start justify-center bg-[#F6F6F8] overflow-hidden pt-25">
      {AUTH_BG === 'banners' ? <DiagonalBannersBackground /> : null}
      <div className="relative z-10">
        <Modal height="h-[550px]">
          <LoginForm />
        </Modal>
      </div>
    </div>
  );
}
