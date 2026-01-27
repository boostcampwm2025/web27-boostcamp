import { Icon } from '@shared/ui/Icon';
import { MAIN_MONETIZE_POINTS } from '../../model/content';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

export function MonetizeSection() {
  return (
    <section id="pricing" className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-gray-900 sm:text-4xl">
            5분이면 수익 창출
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
            복잡한 설정 없이 시작하고, 필요한 곳만 디테일하게 조정하세요.
            개발자가 좋아하는 속도로 운영할 수 있습니다.
          </p>

          <ul className="mt-8 space-y-4">
            {MAIN_MONETIZE_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center text-blue-600">
                  <Icon.Check className="h-4 w-4" />
                </span>
                <span className="text-sm leading-6 text-gray-700">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <PrimaryButton to="/auth/register">시작하기</PrimaryButton>
            <SecondaryButton href="#developer">API 문서</SecondaryButton>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0b1020] p-6 shadow-[0px_24px_70px_rgba(17,24,39,0.25)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white/90">config.ts</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              copy &amp; paste
            </span>
          </div>

          <pre className="mt-5 overflow-x-auto rounded-xl bg-black/30 px-4 py-4 font-mono text-[12px] leading-5 text-white/90">
            <code>
              <span className="text-blue-300">export</span>{' '}
              <span className="text-blue-300">default</span>{' '}
              <span className="text-gray-100">{'{'}</span>
              {'\n'}
              {'  '}
              <span className="text-gray-100">publisherId</span>
              <span className="text-blue-300">:</span>{' '}
              <span className="text-amber-200">'boostad_demo'</span>
              <span className="text-gray-100">,</span>
              {'\n'}
              {'  '}
              <span className="text-gray-100">slots</span>
              <span className="text-blue-300">:</span>{' '}
              <span className="text-gray-100">[</span>
              <span className="text-gray-100">{'{'}</span>{' '}
              <span className="text-gray-100">id</span>
              <span className="text-blue-300">:</span>{' '}
              <span className="text-amber-200">'main'</span>
              <span className="text-gray-100">, </span>
              <span className="text-gray-100">format</span>
              <span className="text-blue-300">:</span>{' '}
              <span className="text-amber-200">'responsive'</span>{' '}
              <span className="text-gray-100">{'}'}</span>
              <span className="text-gray-100">]</span>
              <span className="text-gray-100">,</span>
              {'\n'}
              {'  '}
              <span className="text-gray-100">privacy</span>
              <span className="text-blue-300">:</span>{' '}
              <span className="text-gray-100">{'{'}</span>{' '}
              <span className="text-gray-100">cookies</span>
              <span className="text-blue-300">:</span>{' '}
              <span className="text-emerald-200">false</span>{' '}
              <span className="text-gray-100">{'}'}</span>
              {'\n'}
              <span className="text-gray-100">{'}'}</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

