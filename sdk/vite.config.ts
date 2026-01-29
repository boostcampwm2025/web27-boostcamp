import { defineConfig } from 'vite';
import path from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'DevAd',
        formats: ['iife'],
        fileName: () => 'sdk.js',
      },
      outDir: 'dist',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, './src/shared'),
      },
    },
    plugins: [
      {
        name: 'copy-to-backend',
        closeBundle() {
          // 개발 환경에서만 backend/public으로 복사
          const src = path.resolve(__dirname, 'dist/sdk.js');
          const destDir = path.resolve(__dirname, '../backend/public');
          const dest = path.resolve(destDir, 'sdk.js');

          // public 디렉토리 생성 (없으면)
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }

          copyFileSync(src, dest);
          console.log('✅ SDK copied to backend/public/sdk.js');
        },
      },
    ],
  };
});
