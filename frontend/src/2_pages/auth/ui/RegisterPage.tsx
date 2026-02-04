import { Modal } from '@shared/ui/Modal';
import { DiagonalBannersBackground } from '@shared/ui/Background';
import { RegisterForm } from '@features/authorize/register/ui/RegisterForm';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@shared/lib/hooks';

const AUTH_BG: 'banners' | 'lines' | 'none' = 'banners'; // 쉽게 제거/비활성화 가능

export function RegisterPage() {
  useDocumentTitle('회원가입');
  return (
    <div className="relative flex min-h-screen w-full items-start justify-center bg-[#F6F6F8] overflow-hidden pt-25">
      {AUTH_BG === 'banners' ? <DiagonalBannersBackground /> : null}
      <div className="relative z-10">
        <Modal height="h-[535px]">
          <div className="flex flex-col gap-3">
            <RegisterForm />
            <div className="flex items-center justify-center text-sm gap-1 ">
              <p className="text-[#616E89]">이미 계정이 있나요?</p>
              <Link to={'/auth/login'}>로그인</Link>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
