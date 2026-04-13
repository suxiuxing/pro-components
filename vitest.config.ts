import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { TEST_INITIAL_URL } from './tests/testConstants';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@xxlabs/pro-components': resolve(rootDir, 'src'),
    },
  },
  test: {
    setupFiles: ['./tests/setupTests.ts'],
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        url: TEST_INITIAL_URL,
      },
    },
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/card/components/TabPane/index.tsx',
        'src/**/typing.ts',
        'src/**/demos/**',
        'src/utils/isDeepEqualReact/*.{ts,tsx}',
      ],
    },
    testTimeout: 60_000,
  },
});
