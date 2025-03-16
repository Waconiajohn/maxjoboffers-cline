/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      'wasp/server': path.resolve(__dirname, './src/mocks/wasp-server.ts'),
      'wasp/server/fileUploads': path.resolve(__dirname, './src/mocks/wasp-server-fileUploads.ts'),
    },
  },
});
