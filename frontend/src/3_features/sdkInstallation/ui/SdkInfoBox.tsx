import { Icon } from '@shared/ui/Icon';
import type { SdkMode } from './SdkModeToggle';

interface SdkInfoBoxProps {
  mode: SdkMode;
}

export function SdkInfoBox({ mode }: SdkInfoBoxProps) {
  const autoFeatures = [
    '코드 복사 감지 (진짜 공부하는 순간)',
    '체류 시간 측정 (얼마나 집중하는지)',
    '스크롤 깊이 추적 (끝까지 읽는지)',
    '왕복 스크롤 감지 (다시 읽는지)',
  ];

  if (mode === 'manual') {
    return (
      <div className="flex flex-col w-150 p-4 gap-2 bg-yellow-50 border border-yellow-300 rounded-xl">
        <div className="flex flex-row gap-2 items-center">
          <Icon.Info className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-sm text-gray-900">
            Naver Boostcamp 전용 모드 안내
          </h3>
        </div>
        <p className="text-xs text-gray-600 pl-7">
          이 설정은 네이버 부스트캠프 프로젝트 전용입니다. 광고는{' '}
          <code className="font-mono bg-yellow-200 px-1 rounded">
            data-boostad-zone
          </code>{' '}
          속성이 포함된 요소 내에만 표시됩니다.{' '}
          <code className="font-mono bg-yellow-200 px-1 rounded">
            data-context
          </code>{' '}
          속성으로 페이지 문맥을 명시하면 해당 문맥에 맞는 광고가 매칭됩니다.{' '}
          <br />
          <br />
          (ex. 난 게임 프로젝트라 게임 프로젝트끼리 서로 홍보하면 시너지가 날 것 같아! ➡️
          data-context="게임" )
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-150 p-4 gap-4 bg-blue-100 border border-blue-300 rounded-xl">
      <div className="flex flex-row gap-2 items-center">
        <Icon.Info className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-sm text-gray-900">SDK가 하는 일</h3>
      </div>

      <ul className="grid grid-cols-2 gap-2 px-7">
        {autoFeatures.map((feature, index) => (
          <li key={index} className="flex flex-row gap-2 items-center">
            <Icon.Circle className="w-1.5 h-1.5 text-blue-500" />
            <span className="text-xs font-base text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
