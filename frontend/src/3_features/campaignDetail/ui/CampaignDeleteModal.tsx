import { Icon } from '@shared/ui/Icon';

interface CampaignDeleteModalProps {
  isOpen: boolean;
  campaignTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function CampaignDeleteModal({
  isOpen,
  campaignTitle,
  onClose,
  onConfirm,
  isDeleting,
}: CampaignDeleteModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-96 bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Icon.Close className="w-6 h-6 text-red-500" />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              캠페인을 삭제하시겠습니까?
            </h3>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">
                {campaignTitle}
              </span>
              <br />
              캠페인이 영구적으로 삭제됩니다.
              <br />이 작업은 되돌릴 수 없습니다.
            </p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-2 px-4 rounded-lg font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2 px-4 rounded-lg font-medium bg-red-700 text-white hover:bg-red-600 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
