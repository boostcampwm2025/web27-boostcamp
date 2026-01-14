import { Modal } from "@/4_shared/ui/Modal";
import { LoginForm } from "../../../3_features/authorize/login/ui/LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F6F6F8]">
      <Modal height="h-[700px]">
        <LoginForm />
        <div className="flex items-center justify-center text-sm ">
          <p className="text-[#616E89]">계정이 없나요?</p>
          <p>회원가입</p>
        </div>
      </Modal>
    </div>
  );
}
