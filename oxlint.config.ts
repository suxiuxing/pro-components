import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['eslint', 'typescript', 'unicorn', 'react', 'oxc', 'import', 'promise'],
  jsPlugins: [],
  categories: {
    correctness: 'error',
  },
  rules: {
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        ignoreUsingDeclarations: false,
        reportUsedIgnorePattern: false,
      },
    ],

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
