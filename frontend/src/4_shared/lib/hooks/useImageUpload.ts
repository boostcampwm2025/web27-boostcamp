import { useState } from 'react';
import { API_CONFIG } from '@shared/lib/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface UploadImageResponse {
  imageUrl: string;
}

interface UseImageUploadReturn {
  upload: (file: File) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return '지원하지 않는 파일 형식입니다. (jpeg, png, webp, gif만 가능)';
  }

  if (file.size > MAX_FILE_SIZE) {
    return '파일 크기가 너무 큽니다. (최대 5MB)';
  }

  return null;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string> => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_CONFIG.baseURL}/api/images`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        const message = data.message || '이미지 업로드에 실패했습니다.';
        setError(message);
        throw new Error(message);
      }

      const result = data.data as UploadImageResponse;
      return result.imageUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { upload, isLoading, error };
}
