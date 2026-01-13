import { Icon } from '@shared/ui/Icon';

export function SdkInfoBox() {
  const features = [
    '코드 복사 감지 (진짜 공부하는 순간)',
    '체류 시간 측정 (얼마나 집중하는지)',
    '스크롤 깊이 추적 (끝까지 읽는지)',
    '왕복 스크롤 감지 (다시 읽는지)',
  ];

  return (
    <div className="flex flex-col min-w-150 p-4 gap-4 bg-blue-100 border border-blue-300 rounded-xl">
      <div className="flex flex-row gap-2 items-center">
        <Icon.Info className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-sm text-gray-900">SDK가 하는 일</h3>
      </div>

      <ul className="grid grid-cols-2 gap-2 px-7">
        {features.map((feature, index) => (
          <li key={index} className="flex flex-row gap-2 items-center">
            <Icon.Circle className="w-1.5 h-1.5 text-blue-500" />
            <span className="text-xs font-base text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
