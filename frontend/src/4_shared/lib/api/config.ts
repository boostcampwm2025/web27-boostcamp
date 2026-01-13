const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

if (!apiUrl) {
  throw new Error('VITE_API_URL is not defined');
}

export const API_CONFIG = {
  baseURL: apiUrl,
};