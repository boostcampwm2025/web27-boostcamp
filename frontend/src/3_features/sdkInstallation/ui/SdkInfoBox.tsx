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
    <div className="flex flex-col w-150 gap-4">
      <div className="flex flex-col p-4 gap-4 bg-blue-100 border border-blue-300 rounded-xl">
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

      <div className="flex flex-col p-4 gap-2 bg-yellow-50 border border-yellow-300 rounded-xl">
        <div className="flex flex-row gap-2 items-center">
          <Icon.Info className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-sm text-gray-900">
            티스토리 모바일 환경 유의사항
          </h3>
        </div>
        <p className="text-xs text-gray-600 pl-7">
          티스토리 기본 설정에서는 모바일 접속 시 별도의 모바일 스킨이 적용되어
          SDK 스크립트가 로드되지 않습니다.
          <br />
          <br />
          <strong>모바일에서도 광고를 노출하려면:</strong>
          <br />
          티스토리 관리자 → 꾸미기 → 스킨 편집 → 모바일 설정에서
          <br />
          <span className="font-semibold text-yellow-700">
            "모바일 웹 지원 안 함"
          </span>
          을 체크해주세요.
          <br />
          <br />
          이렇게 설정하면 PC와 모바일 모두 동일한 스킨을 사용하여 SDK가 정상
          작동합니다.
        </p>
      </div>
    </div>
  );
}
