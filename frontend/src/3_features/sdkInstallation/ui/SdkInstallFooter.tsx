import { Icon } from '@shared/ui/Icon';

interface SdkInstallFooterProps {
  onNavigateToDashboard?: () => void;
  onRedirectToMyWeb?: () => void;
}

export function SdkInstallFooter({
  onNavigateToDashboard,
  onRedirectToMyWeb,
}: SdkInstallFooterProps) {
  return (
    <div className="flex flex-col w-150 items-center gap-2">
      <div className="flex gap-2">
        <button
          className="flex flex-row bg-white items-center py-3 border border-gray-300 px-8 gap-1.5 text-gray-600 rounded-lg"
          onClick={onRedirectToMyWeb}
        >
          <span className="text-base font-medium cursor-pointer">
            내 웹사이트로 이동
          </span>
          <Icon.ArrowRight className="w-3" />
        </button>
        <button
          className="flex flex-row bg-blue-500 items-center py-3  px-8 gap-1.5 text-white rounded-lg"
          onClick={onNavigateToDashboard}
        >
          <span className="text-base font-medium cursor-pointer">
            대시보드로 이동
          </span>
          <Icon.ArrowRight className="w-3" />
        </button>
      </div>

      <p className="text-xs font-normal whitespace-nowrap text-gray-500">
        설치 확인 후 자동으로 광고 게재가 시작됩니다
      </p>
    </div>
  );
}
