import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@shared/ui/Icon';

const CURRENT_YEAR = new Date().getFullYear();
const HERO_BARS = Array.from({ length: 12 }, (_, index) => ({
  height: 12 + ((index * 7) % 22),
  fillWidth: 40 + ((index * 19) % 60),
}));

const NAV_ITEMS = [
  { label: '솔루션', href: '#solution' },
  { label: '개발자', href: '#developer' },
  { label: '가격', href: '#pricing' },
  { label: '블로그', href: '#blog' },
] as const;

const FEATURE_STEPS = [
  {
    title: '서드파티 쿠키 없이',
    description:
      '추적 기반 타게팅 대신 콘텐츠 문맥을 이해해 광고를 매칭합니다.',
    IconComponent: Icon.Stop2,
  },
  {
    title: '맥락 분석',
    description:
      '페이지의 핵심 키워드·주제를 추출해 의도를 정확히 파악합니다.',
    IconComponent: Icon.Terminal,
  },
  {
    title: '의도 매칭',
    description:
      '오디언스가 지금 찾는 정보와 가장 가까운 광고를 연결합니다.',
    IconComponent: Icon.ClickLine,
  },
  {
    title: '수익 최적화',
    description:
      '실시간 경매 로그로 성과를 확인하고 수익화를 빠르게 반복합니다.',
    IconComponent: Icon.Dollar,
  },
] as const;

const LOG_ROWS = [
  {
    time: '14:32:41',
    page: '/docs/react-hooks',
    keyword: 'useEffect',
    bid: '$14.50 CPM',
    result: '+24%',
  },
  {
    time: '14:32:45',
    page: '/blog/vite-migration',
    keyword: 'Vite',
    bid: '$11.20 CPM',
    result: '+18%',
  },
  {
    time: '14:32:50',
    page: '/docs/tailwind-v4',
    keyword: 'Tailwind CSS',
    bid: '$9.80 CPM',
    result: '+12%',
  },
  {
    time: '14:32:55',
    page: '/docs/privacy',
    keyword: 'Privacy',
    bid: '$13.10 CPM',
    result: '+21%',
  },
] as const;

const MONETIZE_POINTS = [
  '빠른 설치: 스크립트 1줄로 시작',
  '개발자 경험: 명확한 로그와 디버깅',
  '프라이버시 친화: 쿠키/식별자 최소화',
  '간편 운영: 슬롯 단위로 실험/롤백',
] as const;

const FOOTER_LINKS = [
  {
    title: '제품',
    links: ['솔루션', '개발자', '가격', '상태'],
  },
  {
    title: '리소스',
    links: ['문서', '가이드', 'API', '커뮤니티'],
  },
  {
    title: '회사',
    links: ['소개', '채용', '블로그', '문의'],
  },
] as const;

function PrimaryButton({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-blue-500 px-5 py-3 text-[15px] font-semibold text-white shadow-[0px_10px_15px_rgba(37,99,235,0.18),0px_4px_6px_rgba(37,99,235,0.18)] transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
    >
      {children}
      <Icon.ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-gray-200 bg-white px-5 py-3 text-[15px] font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
    >
      {children}
      <Icon.ArrowRight className="h-4 w-4 text-gray-500" />
    </a>
  );
}

export function MainPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/main" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Icon.Logo className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-[-0.3px]">
              BoostAD
            </span>
          </Link>

          <nav
            className="hidden items-center gap-8 text-sm font-medium text-gray-900 md:flex"
            aria-label="메인 내비게이션"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/auth/login"
              className="hidden text-sm font-medium text-gray-900 transition-colors hover:text-blue-600 sm:inline-flex"
            >
              로그인
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center rounded-[10px] bg-blue-500 px-4 py-2 text-sm font-bold text-white shadow-[0px_10px_15px_rgba(37,99,235,0.16),0px_4px_6px_rgba(37,99,235,0.16)] transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(37,99,235,0.06)_0%,transparent_0%),linear-gradient(rgba(37,99,235,0.06)_0%,transparent_0%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(147deg,rgba(59,130,246,0.14)_0%,rgba(37,99,235,0.06)_52%,transparent_100%)]" />

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">
              <span className="h-2 w-2 rounded-full bg-blue-500/60" />
              v2.0 정식 출시
            </div>

            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold tracking-[-0.05em] text-gray-900 sm:text-6xl">
              광고가 정보가 되는 경험
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              프라이버시를 침해하지 않으면서 오디언스의 의도를 수익으로
              전환하세요.
              <br className="hidden sm:block" />
              개발자 블로그와 기술 문서를 위해 특별히 설계된 맥락 기반
              광고입니다.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <PrimaryButton to="/auth/register">맥락 매칭 시작하기</PrimaryButton>
              <SecondaryButton href="#developer">문서 보기</SecondaryButton>
            </div>

            <div className="relative mx-auto mt-14 hidden h-[280px] max-w-4xl md:block">
              <div className="absolute left-0 top-16 w-[220px] rounded-2xl bg-white p-4 shadow-[0px_10px_30px_rgba(17,24,39,0.08)]">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon.Pen className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      블로그
                    </p>
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
                  <p className="text-sm font-semibold text-gray-900">
                    수익 상승
                  </p>
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

        <section id="solution" className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-3xl font-extrabold tracking-[-0.03em] text-gray-900 sm:text-4xl">
              추적을 멈추고, 매칭을 시작하세요
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-gray-600 sm:text-base">
              기술 문서·개발자 블로그에 최적화된 맥락 기반 광고로 전환율과
              수익을 함께 올려보세요.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {FEATURE_STEPS.map((step) => (
                <div
                  key={step.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-[0px_18px_55px_rgba(17,24,39,0.08)]"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <step.IconComponent className="h-6 w-6" />
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
              ))}
            </div>
          </div>
        </section>

        <section id="developer" className="bg-gray-50">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-gray-900 sm:text-4xl">
                  실시간 경매 로그
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                  어떤 문맥에서 어떤 광고가 선택됐는지 즉시 확인하세요. 문제는
                  빨리 찾고, 개선은 더 빠르게.
                </p>
              </div>

              <a
                href="#logs"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
              >
                LIVE 보기
                <Icon.ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div
              id="logs"
              className="mt-10 overflow-hidden rounded-2xl border border-white/20 bg-gray-900 shadow-[0px_24px_70px_rgba(17,24,39,0.25)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-medium text-white/60">
                  realtime-auction.log
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left font-mono text-[12px] leading-5 text-white/90">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      <th className="px-6 py-3 font-medium">Time</th>
                      <th className="px-6 py-3 font-medium">Page</th>
                      <th className="px-6 py-3 font-medium">Keyword</th>
                      <th className="px-6 py-3 font-medium">Bid</th>
                      <th className="px-6 py-3 font-medium text-right">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {LOG_ROWS.map((row) => (
                      <tr
                        key={`${row.time}-${row.page}`}
                        className="border-t border-white/10"
                      >
                        <td className="px-6 py-3 text-white/70">{row.time}</td>
                        <td className="px-6 py-3">{row.page}</td>
                        <td className="px-6 py-3 text-blue-200">
                          {row.keyword}
                        </td>
                        <td className="px-6 py-3 text-emerald-200">
                          {row.bid}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-200">
                            {row.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

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
                {MONETIZE_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
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
                <p className="text-sm font-semibold text-white/90">
                  config.ts
                </p>
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

        <footer id="blog" className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Icon.Logo className="h-5 w-5" />
                </span>
                <span className="text-lg font-bold tracking-[-0.3px]">
                  BoostAD
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                개발자 문서와 블로그에 자연스럽게 스며드는
                <br className="hidden sm:block" />
                프라이버시 친화 광고.
              </p>
            </div>

            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-bold text-gray-900">{group.title}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="transition-colors hover:text-blue-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© {CURRENT_YEAR} BoostAD. All rights reserved.</p>
              <p className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                Status: Operational
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
