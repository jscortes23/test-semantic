import { scopes, types } from './scripts/commitlintConstants.mjs'

export default {
  extends: ['@commitlint/config-conventional'],
  formatter: './scripts/commitlintFormatter.mjs',
  rules: {
    'type-enum': [2, 'always', types],
    // Warning only: an unknown scope is reported but does not block the commit.
    'scope-enum': [1, 'always', scopes],
    'scope-empty': [0],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
}
