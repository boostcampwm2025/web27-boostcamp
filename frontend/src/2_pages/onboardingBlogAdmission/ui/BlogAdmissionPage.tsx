import { AdmissionForm } from '@/3_features/blogAdmission/ui/AdmissionForm';
import { Modal } from '@/4_shared/ui/Modal';

export function BlogAdmissionPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F6F6F8]">
      <Modal height="h-[550px]">
        <AdmissionForm/>
      </Modal>
    </div>
  );
}
