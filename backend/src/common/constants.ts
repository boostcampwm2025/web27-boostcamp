import { Tag } from '../types/tag';

// Mock 블로그 데이터 (ERD 스키마 준수)
export interface MockBlog {
  id: number;
  user_id: number;
  domain: string;
  name: string;
  blog_key: string;
  verified: boolean;
  created_at: string;
  deleted_at: string | null;
}

export const MOCK_BLOGS: MockBlog[] = [
  {
    id: 1,
    user_id: 1,
    domain: 'tech.example.com',
    name: '테크 블로그',
    blog_key: 'tech-blog-1',
    verified: true,
    created_at: '2025-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 2,
    user_id: 1,
    domain: 'dev.example.com',
    name: '개발 블로그',
    blog_key: 'dev-blog-2',
    verified: true,
    created_at: '2025-01-02T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 3,
    user_id: 1,
    domain: 'test.example.com',
    name: '테스트 블로그',
    blog_key: 'test-blog',
    verified: true,
    created_at: '2025-01-03T00:00:00Z',
    deleted_at: null,
  },
];

export const AVAILABLE_TAGS: Tag[] = [
  // Programming Languages
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: 'Python' },
  { id: 4, name: 'Java' },
  { id: 5, name: 'Go' },
  { id: 6, name: 'Rust' },
  { id: 7, name: 'C++' },
  { id: 8, name: 'C#' },
  { id: 9, name: 'Kotlin' },
  { id: 10, name: 'Swift' },
  { id: 11, name: 'PHP' },
  { id: 12, name: 'Ruby' },

  // Frontend Frameworks & Libraries
  { id: 13, name: 'React' },
  { id: 14, name: 'Vue' },
  { id: 15, name: 'Angular' },
  { id: 16, name: 'Svelte' },
  { id: 17, name: 'NextJS' },
  { id: 18, name: 'Nuxt' },
  { id: 19, name: 'Remix' },
  { id: 20, name: 'Astro' },
  { id: 21, name: 'SolidJS' },
  { id: 22, name: 'Preact' },
  { id: 23, name: 'Qwik' },

  // Backend Frameworks
  { id: 24, name: 'NestJS' },
  { id: 25, name: 'Express' },
  { id: 26, name: 'Fastify' },
  { id: 27, name: 'Koa' },
  { id: 28, name: 'Spring' },
  { id: 29, name: 'Spring Boot' },
  { id: 30, name: 'Django' },
  { id: 31, name: 'Flask' },
  { id: 32, name: 'FastAPI' },
  { id: 33, name: 'Rails' },
  { id: 34, name: 'Laravel' },
  { id: 35, name: 'ASP.NET' },
  { id: 36, name: 'Gin' },
  { id: 37, name: 'Fiber' },

  // Databases
  { id: 38, name: 'MySQL' },
  { id: 39, name: 'PostgreSQL' },
  { id: 40, name: 'MongoDB' },
  { id: 41, name: 'Redis' },
  { id: 42, name: 'Elasticsearch' },
  { id: 43, name: 'Cassandra' },
  { id: 44, name: 'DynamoDB' },
  { id: 45, name: 'SQLite' },
  { id: 46, name: 'MariaDB' },
  { id: 47, name: 'Oracle' },
  { id: 48, name: 'SQL Server' },
  { id: 49, name: 'SQL' },

  // DevOps & Cloud
  { id: 50, name: 'Docker' },
  { id: 51, name: 'Kubernetes' },
  { id: 52, name: 'AWS' },
  { id: 53, name: 'GCP' },
  { id: 54, name: 'Azure' },
  { id: 55, name: 'Jenkins' },
  { id: 56, name: 'GitHub Actions' },
  { id: 57, name: 'GitLab CI' },
  { id: 58, name: 'CircleCI' },
  { id: 59, name: 'Terraform' },
  { id: 60, name: 'Ansible' },
  { id: 61, name: 'Nginx' },
  { id: 62, name: 'Apache' },

  // Tools & Version Control
  { id: 63, name: 'Git' },
  { id: 64, name: 'GitHub' },
  { id: 65, name: 'GitLab' },
  { id: 66, name: 'Bitbucket' },
  { id: 67, name: 'npm' },
  { id: 68, name: 'Yarn' },
  { id: 69, name: 'pnpm' },
  { id: 70, name: 'Webpack' },
  { id: 71, name: 'Vite' },
  { id: 72, name: 'Rollup' },
  { id: 73, name: 'esbuild' },
  { id: 74, name: 'Babel' },
  { id: 75, name: 'ESLint' },
  { id: 76, name: 'Prettier' },

  // API & Communication
  { id: 77, name: 'REST' },
  { id: 78, name: 'GraphQL' },
  { id: 79, name: 'gRPC' },
  { id: 80, name: 'WebSocket' },
  { id: 81, name: 'tRPC' },
  { id: 82, name: 'Swagger' },
  { id: 83, name: 'Postman' },

  // Testing
  { id: 84, name: 'Jest' },
  { id: 85, name: 'Vitest' },
  { id: 86, name: 'Cypress' },
  { id: 87, name: 'Playwright' },
  { id: 88, name: 'Selenium' },
  { id: 89, name: 'JUnit' },
  { id: 90, name: 'Pytest' },

  // State Management & Data Fetching
  { id: 91, name: 'Redux' },
  { id: 92, name: 'Zustand' },
  { id: 93, name: 'Recoil' },
  { id: 94, name: 'Jotai' },
  { id: 95, name: 'MobX' },
  { id: 96, name: 'React Query' },
  { id: 97, name: 'SWR' },

  // Mobile & Cross-platform
  { id: 98, name: 'React Native' },
  { id: 99, name: 'Flutter' },
  { id: 100, name: 'Electron' },
  { id: 101, name: 'Tauri' },

  // AI & Machine Learning
  { id: 102, name: 'AI' },
  { id: 103, name: 'Machine Learning' },
  { id: 104, name: 'TensorFlow' },
  { id: 105, name: 'PyTorch' },
  { id: 106, name: 'OpenAI' },

  // Other Popular Technologies
  { id: 107, name: 'Node.js' },
  { id: 108, name: 'Deno' },
  { id: 109, name: 'Bun' },
  { id: 110, name: 'Tailwind CSS' },
  { id: 111, name: 'Sass' },
  { id: 112, name: 'CSS' },
  { id: 113, name: 'HTML' },
  { id: 114, name: 'WebAssembly' },
  { id: 115, name: 'Blockchain' },
];
