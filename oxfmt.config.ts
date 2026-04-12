import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  singleAttributePerLine: true,
  sortImports: {
    internalPattern: ['@/', '@xxlabs/'],
  },
  sortPackageJson: {
    sortScripts: true,
  },
  ignorePatterns: [
    '.agents',
    'public',
    'tests/**/__snapshots__/**',
    'CHANGELOG.md',
    'skills-lock.json',
  ],
});
