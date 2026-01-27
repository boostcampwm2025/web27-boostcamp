import type { ComponentType, SVGProps } from 'react';
import { Icon } from '@shared/ui/Icon';
import { HIGH_INTENT_STEPS } from '../../model/content';
import type { HighIntentStepIcon } from '../../model/content';

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

const STEP_ICONS = {
  Copy: Icon.Copy,
  Eye: Icon.Eye,
  Clock: Icon.Clock,
  Click: Icon.Click,
} satisfies Record<HighIntentStepIcon, SvgIcon>;

export function HighIntentSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-gray-900 sm:text-4xl">
            진짜 관심이 있는 순간을 포착합니다
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            단순 노출수(PV)가 아닌, 사용자의 적극적인 학습 행동(High Intent)을 신호로 사용합니다.
            <br className="hidden sm:block" />
            허수 트래픽을 거르고 진짜 잠재 고객을 만나세요.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HIGH_INTENT_STEPS.map((step) => {
              const StepIcon = STEP_ICONS[step.icon];

              return (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:ring-blue-100"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <StepIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {step.description}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gray-50 px-3 py-1">
                    <span className="text-xs font-medium text-gray-500">
                      {step.statLabel}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {step.stat}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
