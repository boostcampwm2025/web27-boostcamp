import { AdmissionForm } from '@/3_features/blogAdmission/ui/AdmissionForm';
import { Modal } from '@/4_shared/ui/Modal';
import { useDocumentTitle } from '@shared/lib/hooks';

export function BlogAdmissionPage() {
  useDocumentTitle('블로그 등록');
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F6F6F8]">
      <Modal height="h-[550px]">
        <AdmissionForm/>
      </Modal>
    </div>
  );
}
