import js from '@eslint/js';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['.dumi', 'dist']),
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    extends: [
      js.configs.recommended,
      tsEslint.configs.recommended,
      eslintPluginReact.configs.flat.recommended,
      eslintPluginReactHooks.configs.flat['recommended-latest'],
      eslintPluginReactRefresh.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      ...eslintPluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { caughtErrors: 'none' }],

      'react-hooks/exhaustive-deps': 'off',

      'react-refresh/only-export-components': 'warn',

      'react/no-unescaped-entities': 'warn',
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: false,
          ignoreCase: false,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],
    },
  },
]);
