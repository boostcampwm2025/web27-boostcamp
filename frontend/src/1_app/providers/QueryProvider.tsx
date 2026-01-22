import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime (데이터가 '신선함'을 유지하는 시간)
      staleTime: 1000 * 60, // 1분
      // gcTime (메모리에 캐시가 남아있는 시간)
      gcTime: 1000 * 60 * 5, // 5분
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
