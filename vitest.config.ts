import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    include: [
      'packages/**/*.test.ts',
      'packages/**/*.test.tsx',
      'apps/**/*.test.ts',
      'apps/**/*.test.tsx',
      'cli/**/*.test.ts',
      'scripts/**/*.test.mjs',
    ],
    exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
    environment: 'node',
    environmentMatchGlobs: [
      ['**/apps/**/*.test.tsx', 'jsdom'],
    ],
    setupFiles: ['vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/**/src/**/*.ts', 'packages/**/src/**/*.tsx'],
      exclude: ['packages/**/src/**/*.test.ts', 'packages/**/src/**/*.test.tsx', 'packages/**/dist/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@moon/orm': path.resolve(__dirname, 'packages/moon-orm/src/index.ts'),
      '@moon/base': path.resolve(__dirname, 'packages/moon-base/src/index.ts'),
      '@moon/mail': path.resolve(__dirname, 'packages/moon-mail/src/index.ts'),
      '@moon/product': path.resolve(__dirname, 'packages/moon-product/src/index.ts'),
      '@moon/account': path.resolve(__dirname, 'packages/moon-account/src/index.ts'),
      '@moon/stock': path.resolve(__dirname, 'packages/moon-stock/src/index.ts'),
      '@moon/crm': path.resolve(__dirname, 'packages/moon-crm/src/index.ts'),
      '@moon/geo': path.resolve(__dirname, 'packages/moon-geo/src/index.ts'),
      '@moon/server': path.resolve(__dirname, 'packages/moon-server/src/index.ts'),
      '@moon/protocol': path.resolve(__dirname, 'packages/moon-protocol/src/index.ts'),
      '@moon/compute': path.resolve(__dirname, 'packages/moon-compute/src/index.ts'),
      '@workspace/error': path.resolve(__dirname, 'packages/error/src/index.ts'),
      '@workspace/types': path.resolve(__dirname, 'packages/types/src/index.ts'),
    }
  }
})
