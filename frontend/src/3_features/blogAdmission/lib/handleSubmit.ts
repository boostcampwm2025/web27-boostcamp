import { API_CONFIG } from '@/4_shared/lib/api';
import axios from 'axios';

function ensureUrlHasScheme(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const blogName = String(formData.get('blogName') ?? '');
  const blogUrl = ensureUrlHasScheme(String(formData.get('blogUrl') ?? ''));

  const body = {
    blogName,
    blogUrl,
  };

  const res = await axios.post(`${API_CONFIG.baseURL}/api/blogs`, body, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });

  const { blogKey } = res.data.data;

  if (!blogKey) {
    throw new Error('블로그 키가 반환되지 않았습니다.');
  }
  return blogKey;
};
