import { Icon } from '@shared/ui/Icon';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

const HERO_BARS = Array.from({ length: 12 }, (_, index) => ({
  height: 12 + ((index * 7) % 22),
  fillWidth: 40 + ((index * 19) % 60),
}));

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(37,99,235,0.06)_0%,transparent_0%),linear-gradient(rgba(37,99,235,0.06)_0%,transparent_0%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(147deg,rgba(59,130,246,0.14)_0%,rgba(37,99,235,0.06)_52%,transparent_100%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-24">
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold tracking-[-0.05em] text-gray-900 sm:text-6xl">
          광고가 정보가 되는 경험
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
          프라이버시를 침해하지 않으면서 오디언스의 의도를 수익으로 전환하세요.
          <br className="hidden sm:block" />
          개발자 블로그와 기술 문서를 위해 특별히 설계된 맥락 기반
          광고입니다.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <PrimaryButton to="/auth/register">맥락 매칭 시작하기</PrimaryButton>
          <SecondaryButton href="">문서 보기</SecondaryButton>
        </div>

        <div className="relative mx-auto mt-14 hidden h-[280px] max-w-4xl md:block">
          <div className="absolute left-0 top-16 w-[220px] rounded-2xl bg-white p-4 shadow-[0px_10px_30px_rgba(17,24,39,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon.Pen className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">블로그</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  React · Vite · DX
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 w-[62%] rounded-full bg-blue-500/70" />
            </div>
          </div>

          <div className="absolute left-1/2 top-0 w-[520px] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0px_18px_55px_rgba(17,24,39,0.12)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-medium text-gray-500">
                context-match.ts
              </span>
            </div>
            <pre className="mt-4 overflow-hidden rounded-xl bg-gray-900 px-4 py-4 text-left text-[12px] leading-5 text-gray-100">
              <code>
                <span className="text-blue-300">import</span>{' '}
                <span className="text-gray-100">{'{'}</span>
                <span className="text-emerald-300"> ContextMatch </span>
                <span className="text-gray-100">{'}'}</span>{' '}
                <span className="text-blue-300">from</span>{' '}
                <span className="text-amber-200">'boostad'</span>
                {'\n'}
                {'\n'}
                <span className="text-blue-300">const</span>{' '}
                <span className="text-gray-100">match</span>{' '}
                <span className="text-blue-300">=</span>{' '}
                <span className="text-gray-100">ContextMatch</span>
                <span className="text-gray-100">(</span>
                <span className="text-gray-100">{'{'}</span>
                {'\n'}
                {'  '}
                <span className="text-gray-100">keywords</span>
                <span className="text-blue-300">:</span>{' '}
                <span className="text-gray-100">[</span>
                <span className="text-amber-200">'React'</span>
                <span className="text-gray-100">, </span>
                <span className="text-amber-200">'Tailwind CSS'</span>
                <span className="text-gray-100">]</span>
                <span className="text-gray-100">,</span>
                {'\n'}
                <span className="text-gray-100">{'}'}</span>
                <span className="text-gray-100">)</span>
                {'\n'}
                {'\n'}
                <span className="text-gray-100">match</span>
                <span className="text-blue-300">.</span>
                <span className="text-gray-100">render</span>
                <span className="text-gray-100">(</span>
                <span className="text-amber-200">'#ad-slot'</span>
                <span className="text-gray-100">)</span>
              </code>
            </pre>
          </div>

          <div className="absolute right-0 top-20 w-[240px] rounded-2xl bg-white p-4 shadow-[0px_10px_30px_rgba(17,24,39,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">수익 상승</p>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                +24%
              </span>
            </div>
            <div className="mt-4 grid grid-cols-12 items-end gap-1">
              {HERO_BARS.map((bar, index) => (
                <div
                  key={index}
                  className="rounded-sm bg-blue-500/20"
                  style={{ height: `${bar.height}px` }}
                >
                  <div
                    className="h-full rounded-sm bg-blue-500/70"
                    style={{ width: `${bar.fillWidth}%` }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-gray-500">
              실시간 로그를 보고 즉시 개선해요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
