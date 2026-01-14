import { Modal } from '@shared/ui/Modal';
import { RegisterForm } from '../../../3_features/authorize/register/ui/RegisterForm';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F6F6F8]">
      <Modal height="h-[900px]">
        <RegisterForm />
        <div className="flex items-center justify-center text-sm ">
          <p className="text-[#616E89]">이미 계정이 있나요?</p>
          <p>로그인</p>
        </div>
      </Modal>
    </div>
  );
}
