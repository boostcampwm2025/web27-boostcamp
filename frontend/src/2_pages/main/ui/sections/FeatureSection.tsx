import type { ComponentType, SVGProps } from 'react';
import { Icon } from '@shared/ui/Icon';
import { MAIN_FEATURE_STEPS } from '../../model/content';
import type { MainFeatureStepIcon } from '../../model/content';

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

const FEATURE_ICONS = {
  Stop2: Icon.Stop2,
  Terminal: Icon.Terminal,
  ClickLine: Icon.ClickLine,
  Dollar: Icon.Dollar,
} satisfies Record<MainFeatureStepIcon, SvgIcon>;

export function FeatureSection() {
  return (
    <section id="solution" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-extrabold tracking-[-0.03em] text-gray-900 sm:text-4xl">
          쿠키가 아닌, 내용에 집중합니다
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-gray-600 sm:text-base">
          독자가 보고 있는 글의 기술 스택과 내용을 분석하여, 가장 필요한 '정보'가 되는 광고를 매칭합니다.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {MAIN_FEATURE_STEPS.map((step) => {
            const StepIcon = FEATURE_ICONS[step.icon];

            return (
              <div
                key={step.title}
                className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg hover:ring-blue-100"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center text-blue-600">
                    <StepIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold tracking-[-0.02em] text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
