import { apiClient } from '@/4_shared/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useBlogKey() {
  return useQuery({
    queryKey: ['blog', 'me', 'key'],
    queryFn: async () =>
      await apiClient<{ blogKey: string }>('/api/blogs/me/key'),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
