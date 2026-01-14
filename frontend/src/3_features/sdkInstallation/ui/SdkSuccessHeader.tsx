import { Icon } from '@shared/ui/Icon';

export function SdkSuccessHeader() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon.Check className="w-12 h-12" />
      <h2 className="text-3xl font-extrabold whitespace-nowrap text-gray-900">
        블로그 등록 완료!
      </h2>
      <p className="text-sm font-normal whitespace-nowrap text-gray-500">
        이제 코드를 복사하여 블로그 구현에 붙여넣으세요
      </p>
    </div>
  );
}
