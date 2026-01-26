import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

const isDev = process.env.NODE_ENV === 'development'; // 이 단계에서는 import.meta.env.NODE_ENV를 사용할 수 없음

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],

  server: isDev
    ? {
        https: {
          key: fs.readFileSync(
            path.resolve(__dirname, '../certs/localhost-key.pem')
          ),
          cert: fs.readFileSync(
            path.resolve(__dirname, '../certs/localhost.pem')
          ),
        },
        port: 5173,
      }
    : {
        port: 5173,
      },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@app',
        replacement: path.resolve(__dirname, 'src/1_app'),
      },
      {
        find: '@features',
        replacement: path.resolve(__dirname, 'src/3_features'),
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, 'src/2_pages'),
      },
      {
        find: '@shared',
        replacement: path.resolve(__dirname, 'src/4_shared'),
      },
    ],
  },
});
