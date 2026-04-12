import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['eslint', 'typescript', 'unicorn', 'react', 'oxc', 'import', 'promise'],
  jsPlugins: [],
  categories: {
    correctness: 'error',
  },
  rules: {
    'no-unused-vars': 'off',

    'react/exhaustive-deps': 'off',
  },
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: '19.2.5',
    },
  },
});
