const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

if (!apiUrl) {
  throw new Error('VITE_API_URL이 정의되지 않았습니다');
}

export const API_CONFIG = {
  baseURL: apiUrl,
};
