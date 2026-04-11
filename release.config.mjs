/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        // Keep detailed release notes in the changelog and GitHub release body.
        // Large notes can exceed the process argument size limit in CI.
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
  ],
};
