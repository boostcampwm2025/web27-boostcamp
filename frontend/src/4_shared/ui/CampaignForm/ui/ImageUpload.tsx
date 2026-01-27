import { useRef, useState } from 'react';
import { Icon } from '@shared/ui/Icon';

interface ImageUploadProps {
  value: string | null;
  onChange: (imageUrl: string | null) => void;
  validationError?: string;
  onUpload: (file: File) => Promise<string>;
}

export function ImageUpload({
  value,
  onChange,
  validationError,
  onUpload,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await onUpload(file);
      onChange(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFileSelect(file);
  };

  const handleClick = () => {
    if (isLoading) return;
    inputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;

    const file = e.dataTransfer.files?.[0] ?? null;
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-gray-900">광고 이미지</label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <span className="text-sm text-gray-500">업로드 중...</span>
          </div>
        ) : value ? (
          <>
            <img
              src={value}
              alt="미리보기"
              className="h-full w-full rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-900"
            >
              <Icon.Close className="h-3 w-3" />
            </button>
          </>
        ) : (
          <>
            <Icon.Cloud className="h-8 w-8 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              이미지 업로드
            </span>
            <span className="text-xs text-gray-500">
              드래그 앤 드롭 또는 클릭하여 선택
            </span>
            <span className="text-xs text-gray-400">권장 크기: 1200x628px</span>
          </>
        )}
      </div>

      {(error || validationError) && (
        <p className="text-sm text-red-500">{error || validationError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
