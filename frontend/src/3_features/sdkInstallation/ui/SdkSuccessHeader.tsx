import { Icon } from '@shared/ui/Icon';
import type { SdkMode } from './SdkModeToggle';

interface SdkSuccessHeaderProps {
  mode: SdkMode;
}

export function SdkSuccessHeader({ mode }: SdkSuccessHeaderProps) {
  const description =
    mode === 'auto'
      ? '아래 코드를 복사하여 블로그에 붙여넣으세요'
      : '아래 코드를 복사하여 웹 서비스의 원하는 위치에 배치하세요';

  return (
    <div className="flex flex-col w-150 items-center gap-2">
      <Icon.Check className="w-12 h-12" />
      <h2 className="text-3xl font-extrabold whitespace-nowrap text-gray-900">
        블로그 등록 완료!
      </h2>
      <p className="text-sm font-normal whitespace-nowrap text-gray-500">
        {description}
      </p>
    </div>
  );
}
