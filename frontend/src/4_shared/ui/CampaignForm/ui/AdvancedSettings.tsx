import { Icon } from '@shared/ui/Icon';
import { DEFAULT_ENGAGEMENT_SCORE } from '../lib/constants';

interface AdvancedSettingsProps {
  isHighIntent: boolean;
  onChange: (isHighIntent: boolean) => void;
}

const SCORE_FEATURES = [
  '스크롤 깊이 (최대 30점)',
  '- 50% 이상: 20점 / 80% 이상: 30점',
  '체류 시간 (최대 40점)',
  '- 1분당 30점 (최대 40점)',
  '복사 행동 (무제한)',
  '- 복사당 5점',
];

export function AdvancedSettings({
  isHighIntent,
  onChange,
}: AdvancedSettingsProps) {
  const isDisabled = !isHighIntent;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-gray-900">고급 설정</label>

      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4">
        {/* 행동 타겟팅 헤더 */}
        <div className="flex items-center gap-2">
          <Icon.ClickLine className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">행동 타겟팅</span>
        </div>

        {/* 라디오 버튼들 */}
        <div className="flex gap-3">
          <label
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              !isHighIntent
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="targeting"
              checked={!isHighIntent}
              onChange={() => onChange(false)}
              className="h-4 w-4 text-blue-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                모든 방문자 (추천)
              </span>
              <span className="text-xs text-gray-500">
                광고를 모든 독자에게 표시
              </span>
            </div>
          </label>

          <label
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              isHighIntent
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="targeting"
              checked={isHighIntent}
              onChange={() => onChange(true)}
              className="h-4 w-4 text-blue-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                고의도 방문자만
              </span>
              <span className="text-xs text-gray-500">
                진짜 관심있는 사람에게만 표시
              </span>
            </div>
          </label>
        </div>

        {/* Engagement Score */}
        <div
          className={`flex flex-col gap-3 transition-opacity ${isDisabled ? 'opacity-40' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">최소 Engagement Score</span>
            <span className="text-sm font-bold text-blue-500">
              {DEFAULT_ENGAGEMENT_SCORE}점
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${DEFAULT_ENGAGEMENT_SCORE}%` }}
            />
          </div>
        </div>

        {/* info 박스 */}
        <div
          className={`flex flex-col gap-4 rounded-xl border border-blue-300 bg-blue-100 p-4 transition-opacity ${isDisabled ? 'opacity-40' : ''}`}
        >
          <div className="flex items-center gap-2">
            <Icon.Info className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-900">
              {DEFAULT_ENGAGEMENT_SCORE}점 이상 고의도 사용자로 판단
            </span>
          </div>

          <ul className="grid grid-cols-2 gap-2 px-7">
            {SCORE_FEATURES.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                {index % 2 === 0 ? (
                  <Icon.Circle className="h-1.5 w-1.5 text-blue-500" />
                ) : null}
                <span className="text-xs text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
