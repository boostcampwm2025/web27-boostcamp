import { API_CONFIG } from './config';

export async function apiClient<T>(endpoint: string): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const rawData = await response.json();

    if (rawData.status === 'error') {
      throw new Error(rawData.message || '요청에 실패했습니다');
    }

    if (!rawData.data) {
      throw new Error(rawData.message || 'API 응답 데이터가 없습니다');
    }

    return rawData.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('네트워크 오류가 발생했습니다');
  }
}
