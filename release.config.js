const isProduction = (process.env.GITHUB_REF_NAME ?? 'main') === 'main'

const releaseRules = [
  { type: 'feat', release: 'minor' },
  { type: 'fix', release: 'patch' },
  { type: 'perf', release: 'patch' },
  { type: 'revert', release: 'patch' },
  { breaking: true, release: 'major' },
]

const changelogPlugins = isProduction
  ? [
      ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md', changelogTitle: '# Changelog' }],
      ['@semantic-release/npm', { npmPublish: false }],
      [
        '@semantic-release/git',
        {
          assets: ['CHANGELOG.md', 'package.json'],
          message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        },
      ],
    ]
  : []

export default {
  branches: ['main', { name: 'develop', prerelease: 'rc', channel: 'next' }],
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits', releaseRules }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    ...changelogPlugins,
    '@semantic-release/github',
  ],
}
