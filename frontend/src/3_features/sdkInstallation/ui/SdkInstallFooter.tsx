import { Icon } from '@shared/ui/Icon';

interface SdkInstallFooterProps {
  onNavigateToDashboard?: () => void;
}

export function SdkInstallFooter({
  onNavigateToDashboard,
}: SdkInstallFooterProps) {
  return (
    <div className="flex flex-col min-w-150 items-center gap-2">
      <button
        className="flex flex-row bg-blue-500 items-center py-3  px-8 gap-1.5 text-white rounded-lg"
        onClick={onNavigateToDashboard}
      >
        <span className="text-base font-medium cursor-pointer">
          대시보드로 이동
        </span>
        <Icon.ArrowRight className="w-3" />
      </button>

      <p className="text-xs font-normal whitespace-nowrap text-gray-500">
        설치 확인 후 자동으로 광고 게재가 시작됩니다
      </p>
    </div>
  );
}
