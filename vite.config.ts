import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const basePath = env.VITE_BASE_PATH || '/docs/';
    return {
      base: basePath,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'docs',
        emptyOutDir: true,
        manifest: true
      }
    };
});
