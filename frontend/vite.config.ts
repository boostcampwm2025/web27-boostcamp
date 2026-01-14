import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],

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
