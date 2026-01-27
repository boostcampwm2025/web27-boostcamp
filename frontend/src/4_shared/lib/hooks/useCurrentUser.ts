import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/lib/api';

interface User {
  userId: number;
  email: string;
  role: string;
  balance: number;
  firstLoginAt: string | null;
  createdAt: string;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient<User>('/api/users/me');
      return response;
    },
    retry: 1,
  });
}
