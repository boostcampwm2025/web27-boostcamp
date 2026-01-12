import { Icon } from '@shared/ui/Icon';

export function SdkSuccessHeader() {
  return (
    <div className="border border-amber-600">
      <Icon.Check className="w-12 h-12" />
      <h2>블로그 등록 완료!</h2>
      <p>이제 코드를 복사하여 블로그 구현에 붙여넣으세요</p>
    </div>
  );
}
