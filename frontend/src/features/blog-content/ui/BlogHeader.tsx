/**
 * 블로그 헤더 컴포넌트
 *
 * Mock 블로그의 상단 네비게이션
 */
export default function BlogHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-indigo-600">
          DevLog - 개발자의 기술 블로그
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          DevAd SDK 테스트 환경 (Mock)
        </p>
      </div>
    </header>
  );
}
