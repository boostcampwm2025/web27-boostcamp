import { useDocumentTitle } from '@shared/lib/hooks';

export function NotFoundPage() {
  useDocumentTitle('페이지를 찾을 수 없습니다');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-600 mt-2">페이지를 찾을 수 없습니다</p>
      </div>
    </div>
  );
}
