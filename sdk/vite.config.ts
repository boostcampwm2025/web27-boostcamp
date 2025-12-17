import { defineConfig } from 'vite';
import path from 'path';
import { copyFileSync } from 'fs';

export default defineConfig({
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
    },
  },
  plugins: [
    {
      name: 'copy-to-backend',
      closeBundle() {
        // 빌드 완료 후 backend/public으로 복사
        const src = path.resolve(__dirname, 'dist/sdk.js');
        const dest = path.resolve(__dirname, '../backend/public/sdk.js');
        copyFileSync(src, dest);
        console.log('✅ SDK copied to backend/public/sdk.js');
      },
    },
  ],
});
