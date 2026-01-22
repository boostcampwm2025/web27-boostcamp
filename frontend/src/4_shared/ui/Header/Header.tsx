import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '@/4_shared/lib/api';
import { Button } from '@shared/ui/Button';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_CONFIG.baseURL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } finally {
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <header className="flex items-center justify-between w-full h-16 bg-white border-b border-gray-200 px-8 text-2xl font-bold text-gray-900 whitespace-nowrap">
      <h1>{title}</h1>
      <Button variant="white" size="sm" onClick={handleLogout}>
        로그아웃
      </Button>
    </header>
  );
}
