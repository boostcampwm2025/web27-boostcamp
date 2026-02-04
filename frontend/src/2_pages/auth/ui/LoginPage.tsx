import { Modal } from '@shared/ui/Modal';
import { DiagonalBannersBackground } from '@shared/ui/Background';
import { LoginForm } from '@features/authorize/login/ui/LoginForm';
import { useDocumentTitle } from '@shared/lib/hooks';

const AUTH_BG: 'banners' | 'lines' | 'none' = 'banners'; // 쉽게 제거/비활성화 가능

export function LoginPage() {
  useDocumentTitle('로그인');
  return (
    <div className="relative flex min-h-screen w-full items-start justify-center bg-[#F6F6F8] overflow-hidden pt-25">
      {AUTH_BG === 'banners' ? <DiagonalBannersBackground /> : null}
      <div className="relative z-10">
        <Modal height="h-[470px]">
          <LoginForm />
        </Modal>
      </div>
    </div>
  );
}
