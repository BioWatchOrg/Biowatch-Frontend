import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/_tests_/setup.ts'],
    include: ['src/_tests_/**/*.test.tsx'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          statements: 80,
          branches: 70,
          functions: 75,
          lines: 80,
        },
      },
    },
  },
});
