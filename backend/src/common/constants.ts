import { Tag } from '../types/tag';

// MOCK_BLOGS는 제거

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

  // 네부캠
  { id: 116, name: '게임' },
  { id: 117, name: '학습도구' },
  { id: 118, name: '실시간 협업' },
  { id: 119, name: '기록/CS' },
  { id: 120, name: '시뮬레이터' },
  { id: 121, name: '메타버스' },
  { id: 122, name: '확장프로그램' },
  { id: 123, name: '소셜' },

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
