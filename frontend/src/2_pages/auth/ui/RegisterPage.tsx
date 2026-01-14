import { Modal } from '@shared/ui/Modal';
import { RegisterForm } from '@features/authorize/register/ui/RegisterForm';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F6F6F8]">
      <Modal height="h-[900px]">
        <RegisterForm />
        <div className="flex items-center justify-center text-sm gap-1 ">
          <p className="text-[#616E89]">이미 계정이 있나요?</p>
          <Link to={'/auth/login'}>로그인</Link>
        </div>
      </Modal>
    </div>
  );
}
