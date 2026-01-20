import { API_CONFIG } from '@/4_shared/lib/api';
import type { AccountType } from '../register/model/types';

export const handleLogin = () => {
  const params = new URLSearchParams({ intent: 'login' });
  window.location.href = `${API_CONFIG.baseURL}/api/auth/google?${params.toString()}`;
};

export const handleRegister = (role: AccountType) => {
  const params = new URLSearchParams({ intent: 'register', role });
  window.location.href = `${API_CONFIG.baseURL}/api/auth/google?${params.toString()}`;
};
