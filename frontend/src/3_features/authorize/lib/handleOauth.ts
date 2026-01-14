import { API_CONFIG } from '@/4_shared/lib/api';

export const handleOauth = () => {
  window.location.href = `${API_CONFIG.baseURL}/auth/google`
};
