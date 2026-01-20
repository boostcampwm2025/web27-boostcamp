import { API_CONFIG } from '@/4_shared/lib/api';
import axios from 'axios';

export const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const body = Object.fromEntries(data);
  await axios.post(`${API_CONFIG.baseURL}/api/blogs`, body, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });
};
