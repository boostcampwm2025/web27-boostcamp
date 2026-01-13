import { MOCK_BLOGS } from '../constants';

// blogKey를 blogId로 변환
export function getBlogIdByKey(blogKey: string): number | null {
  const blog = MOCK_BLOGS.find((b) => b.blog_key === blogKey);
  return blog ? blog.id : null;
}

// blogId로 블로그 정보 조회
export function getBlogById(blogId: number) {
  return MOCK_BLOGS.find((b) => b.id === blogId) || null;
}

// blogKey로 블로그 정보 조회
export function getBlogByKey(blogKey: string) {
  return MOCK_BLOGS.find((b) => b.blog_key === blogKey) || null;
}
