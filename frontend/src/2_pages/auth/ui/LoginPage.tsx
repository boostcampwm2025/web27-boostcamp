import { Modal } from '@shared/ui/Modal';
import { DiagonalBannersBackground } from '@shared/ui/Background';
import { LoginForm } from '@features/authorize/login/ui/LoginForm';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@shared/lib/hooks';

const AUTH_BG: 'banners' | 'lines' | 'none' = 'banners'; // 쉽게 제거/비활성화 가능

export function LoginPage() {
  useDocumentTitle('로그인');
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#F6F6F8] overflow-hidden">
      {AUTH_BG === 'banners' ? <DiagonalBannersBackground /> : null}
      <div className="relative z-10">
        <Modal height="h-[700px]">
          <div className="flex flex-col gap-3">
            <LoginForm />
            <div className="flex items-center justify-center gap-1 text-sm">
              <p className="text-[#616E89]">계정이 없나요?</p>
              <Link to={'/auth/register'}>회원가입</Link>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
