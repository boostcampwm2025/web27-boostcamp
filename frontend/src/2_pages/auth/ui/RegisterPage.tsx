import { Modal } from '@shared/ui/Modal';
import { RegisterForm } from './RegisterForm';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F6F6F8]">
      <Modal height="h-[1000px]">
        <RegisterForm />
      </Modal>
    </div>
  );
}
