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
                <span className="text-sm leading-6 text-gray-700">{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <PrimaryButton to="/auth/register">시작하기</PrimaryButton>
            <SecondaryButton href="#developer">API 문서</SecondaryButton>
          </div>
        </div>

        <div className="rounded-2xl bg-[#1F2937] p-6 shadow-[0px_24px_70px_rgba(17,24,39,0.25)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white/90">
              index.html (head)
            </p>
            <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 9H3.5C2.94772 9 2.5 8.55228 2.5 8V3.5H8C8.55228 3.5 9 3.94772 9 4.5V5.5M5.5 11.5H10.5C11.0523 11.5 11.5 11.0523 11.5 10.5V6.5C11.5 5.94772 11.0523 5.5 10.5 5.5H5.5C4.94772 5.5 4.5 5.94772 4.5 6.5V10.5C4.5 11.0523 4.94772 11.5 5.5 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              복사하기
            </button>
          </div>

          <pre className="mt-5 overflow-x-auto rounded-xl bg-[#1F2937] px-6 py-6 font-mono text-[13px] leading-6 text-white/90">
            <code>
              <span className="text-blue-300">&lt;script</span>{' '}
              <span className="text-sky-300">src</span>
              <span className="text-gray-400">=</span>
              <span className="text-amber-200">
                "https://cdn.example.com/sdk.js"
              </span>
              {'\n'}
              {'        '}
              <span className="text-sky-300">data-blog-key</span>
              <span className="text-gray-400">=</span>
              <span className="text-amber-200">
                "98761234-example-key-1234"
              </span>
              {'\n'}
              {'        '}
              <span className="text-sky-300">async</span>
              {'\n'}
              <span className="text-blue-300">&gt;&lt;/script&gt;</span>
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

