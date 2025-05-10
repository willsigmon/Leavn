import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
    globals: true,
  },
});
