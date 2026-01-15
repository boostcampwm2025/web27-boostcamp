import { Modal } from '@shared/ui/Modal';
import { LoginForm } from '@features/authorize/login/ui/LoginForm';
import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F6F6F8]">
      <Modal height="h-[700px]">
        <LoginForm />
        <div className="flex items-center justify-center text-sm gap-1 ">
          <p className="text-[#616E89]">계정이 없나요?</p>
          <Link to={'/auth/register'}>회원가입</Link>
        </div>
      </Modal>
    </div>
  );
}
