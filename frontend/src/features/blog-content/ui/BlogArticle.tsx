import type { Tag } from '@/shared/config/constants';

interface BlogArticleProps {
  selectedTags: Tag[];
}

// Mock 블로그 글 컴포넌트 (SDK 테스트용)
export default function BlogArticle({ selectedTags }: BlogArticleProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {selectedTags.join('과 ')}로 타입 안전한 웹 개발하기
      </h1>

      <div className="flex gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
        <span>📅 2024-12-17</span>
        <span>👤 김개발</span>
        <span>🏷️ {selectedTags.join(', ')}</span>
      </div>

      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed mb-4">
          안녕하세요! 오늘은 {selectedTags.join(', ')}를 활용하여 현대적인 웹
          애플리케이션을 개발하는 방법에 대해 알아보겠습니다.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          1. 왜 이 기술들을 선택했을까?
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          현대 웹 개발에서 {selectedTags[0]}는 핵심적인 역할을 합니다. 특히{' '}
          {selectedTags[1] || '다른 기술'}과 함께 사용하면 더욱 강력한 개발
          환경을 구축할 수 있습니다.
        </p>

        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`// ${selectedTags[0]} 예제 코드
function example() {
  console.log('Hello from ${selectedTags.join(' + ')}!');
  return { success: true };
}`}</code>
        </pre>

        {/* 광고 존 - SDK가 자동으로 광고 렌더링 */}
        <div className="my-8 flex justify-center">
          <div data-devad-zone></div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          2. 실전 적용 사례
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          실제 프로젝트에서 이러한 기술 스택을 어떻게 활용하는지 살펴보겠습니다.
          많은 기업들이 이미 {selectedTags[0]}를 프로덕션 환경에서 활용하고
          있습니다.
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          {selectedTags.map((tag, index) => (
            <li key={index}>{tag}를 활용한 효율적인 개발 방법론</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
          3. 마무리
        </h2>

        <p className="text-gray-700 leading-relaxed">
          {selectedTags.join(', ')}를 활용하면 생산성 높고 안정적인
          애플리케이션을 개발할 수 있습니다. 계속해서 새로운 기술을 학습하고
          적용해보세요!
        </p>
      </div>
    </article>
  );
}
