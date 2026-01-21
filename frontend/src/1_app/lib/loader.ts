import { API_CONFIG } from '@/4_shared/lib/api';
import axios from 'axios';

export const handleFirstLogin = async () => {
  const data = await axios.post(
    `${API_CONFIG.baseURL}/api/users/me/first-login`,
    null,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const { isFirstLogin } = data.data;
};
