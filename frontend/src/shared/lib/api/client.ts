import { API_CONFIG } from './config';

export async function apiClient<T>(endpoint: string): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message || '요청에 실패했습니다');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('네트워크 오류가 발생했습니다');
  }
}
