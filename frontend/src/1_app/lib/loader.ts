import { API_CONFIG } from '@/4_shared/lib/api';
import axios from 'axios';
import { redirect } from 'react-router-dom';

type Role = 'PUBLISHER' | 'ADVERTISER' | 'ADMIN';

const LOGIN_PATH = '/auth/login';
const BLOG_ADMISSION_PATH = '/publisher/onboarding/blog-admission';
const PUBLISHER_DASHBOARD_PATH = '/publisher/dashboard/main';
const ADVERTISER_DASHBOARD_PATH = '/advertiser/dashboard/main';
const PUBLISHER_ENTRY = '/publisher/entry';

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

const createRoleGuardLoader = (required: Role) => async () => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/users/me`, {
      withCredentials: true,
    });

    const { role } = res.data.data;
    if (role !== required) {
      if (role === 'PUBLISHER') return redirect(PUBLISHER_ENTRY);
      if (role === 'ADVERTISER') return redirect(ADVERTISER_DASHBOARD_PATH);
      return redirect('/');
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw redirect(LOGIN_PATH);
    }
    throw error;
  }
};

export const publisherGateLoader = createRoleGuardLoader('PUBLISHER');

export const advertiserGateLoader = createRoleGuardLoader('ADVERTISER');

// 로그인,회원가입 페이지에 걸어둘 예정, 일단 개발 편의성을 위해 뺌
export const guestOnlyLoader = async () => {
  try {
    const res = await axios.get(`${API_CONFIG.baseURL}/api/users/me`, {
      withCredentials: true,
    });

    const { role } = res.data.data;

    if (role === 'PUBLISHER') {
      return redirect(PUBLISHER_ENTRY);
    } else if (role === 'ADVERTISER') {
      return redirect(ADVERTISER_DASHBOARD_PATH);
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return null;
      }
      // 반복 리다이렉트/요청 등으로 throttling 걸린 경우에도 일단 페이지는 열어둠
      if (error.response?.status === 429) {
        return null;
      }
    }
    throw error;
  }
};
