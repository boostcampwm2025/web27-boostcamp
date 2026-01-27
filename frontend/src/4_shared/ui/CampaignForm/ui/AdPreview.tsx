import { useState } from 'react';

interface AdPreviewProps {
  title: string;
  content: string;
  imageUrl: string | null;
}

export function AdPreview({ title, content, imageUrl }: AdPreviewProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const showImage = imageUrl && !imageError;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-bold text-gray-900">광고 미리보기</span>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-4 text-[10px] uppercase tracking-wide text-gray-400">
          Sponsored
        </div>

        <div className="flex flex-wrap items-stretch gap-5">
          {showImage && (
            <img
              src={imageUrl}
              alt={title || '광고 이미지'}
              onError={handleImageError}
              className="h-50 w-50 shrink-0 rounded-lg object-cover"
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="mb-3 text-xl font-semibold leading-snug text-gray-800">
              {title || '광고 제목'}
            </h3>

            <p className="mb-6 grow text-[15px] leading-relaxed text-gray-500">
              {content || '광고 내용이 여기에 표시됩니다.'}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 pt-4">
              <span className="inline-block cursor-not-allowed whitespace-nowrap rounded-lg bg-linear-to-br from-[#667eea] to-[#764ba2] px-6 py-3 text-sm font-semibold text-white opacity-80">
                자세히 보기 →
              </span>

              <span className="whitespace-nowrap text-[11px] text-gray-400">
                by <strong>BoostAD</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
