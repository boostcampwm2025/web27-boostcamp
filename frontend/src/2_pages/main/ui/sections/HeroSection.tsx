import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { HeroAlgorithmicMatch } from '../components/HeroAlgorithmicMatch';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,rgba(37,99,235,0.06)_0%,transparent_0%),linear-gradient(rgba(37,99,235,0.06)_0%,transparent_0%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(147deg,rgba(59,130,246,0.14)_0%,rgba(37,99,235,0.06)_52%,transparent_100%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-12 text-center sm:pt-16">
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold tracking-[-0.05em] text-gray-900 sm:text-6xl">
          개발자의 '학습 순간'을 연결합니다
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
          무분별한 추적 대신, 지금 읽고 있는 코드와 기술 문맥에 집중합니다.
          <br className="hidden sm:block" />
          독자의 학습 흐름을 끊지 않는 가장 자연스러운 광고를 만나보세요.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <PrimaryButton to="/auth/register">지금 시작하기</PrimaryButton>
          <SecondaryButton href="https://github.com/boostcampwm2025/web27-BoostAD/wiki">
            문서 보기
          </SecondaryButton>
        </div>

        <HeroAlgorithmicMatch />
      </div>
    </section>
  );
}
