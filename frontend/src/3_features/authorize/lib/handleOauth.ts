import { API_CONFIG } from '@/4_shared/lib/api';

export const handleLogin = () => {
  const params = new URLSearchParams({ intent: 'login' });
  window.location.href = `${API_CONFIG.baseURL}/api/auth/google?${params.toString()}`;
};

export const handleRegister = () => {
  const params = new URLSearchParams({ intent: 'register' });
  window.location.href = `${API_CONFIG.baseURL}/api/auth/google?${params.toString()}`;
};
