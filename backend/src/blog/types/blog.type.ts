export interface CachedBlog {
  id: number;
  userId: number;
  domain: string;
  name: string;
  blogKey: string;
  verified: boolean;
  createdAt: string; // ISO string
  embedding?: number[]; // Worker가 나중에 추가
}
