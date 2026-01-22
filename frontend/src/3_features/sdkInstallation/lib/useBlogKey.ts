import { apiClient } from '@/4_shared/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useBlogKey() {
  return useQuery({
    queryKey: ['blog', 'me', 'key'],
    queryFn: async () => await apiClient<string>('/api/blogs/me/key'),
  });
}
