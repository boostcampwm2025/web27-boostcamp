import { API_CONFIG } from '@/4_shared/lib/api';
import axios from 'axios';
import { redirect } from 'react-router-dom';

const LOGIN_PATH = '/auth/login';
const BLOG_ADMISSION_PATH = '/publisher/onboarding/blog-admission';
const PUBLISHER_DASHBOARD_PATH = '/publisher/dashboard/main';

export const publisherEntryLoader = async () => {
  try {
    const res = await axios.post(
      `${API_CONFIG.baseURL}/api/users/me/first-login`,
      {},
      {
        withCredentials: true,
      }
    );

    const { isFirstLogin } = res.data.data;
    return redirect(
      isFirstLogin ? BLOG_ADMISSION_PATH : PUBLISHER_DASHBOARD_PATH
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // 로그인 만료 체크
      throw redirect(LOGIN_PATH);
    }
    throw error;
  }
};

export const publisherBlogRequiredLoader = async () => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/blogs/me/exists`, {
      withCredentials: true,
    });

    const { exists } = res.data.data;
    if (!exists) {
      return redirect(BLOG_ADMISSION_PATH);
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw redirect(LOGIN_PATH);
    }
    throw error;
  }
};
