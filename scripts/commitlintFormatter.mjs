import { scopes, types } from './commitlintConstants.mjs'

const hints = {
  'type-empty': 'The message must start with a type.',
  'type-enum': `Invalid type. Use one of: ${types.join(', ')}.`,
  'type-case': 'The type must be lowercase.',
  'scope-enum': `Unknown scope. Prefer one of: ${scopes.join(', ')}. The scope is optional.`,
  'scope-case': 'The scope must be lowercase.',
  'subject-empty': 'The message needs a description after "type(scope): ".',
  'subject-full-stop': 'Remove the trailing period from the description.',
  'header-max-length': 'Keep the first line under 100 characters.',
  'body-leading-blank': 'Leave a blank line between the first line and the body.',
  'footer-leading-blank': 'Leave a blank line before the footer.',
}

export default function format({ results = [] } = {}) {
  const lines = []

  for (const result of results) {
    const errors = result.errors ?? []
    const warnings = result.warnings ?? []
    const header = (result.input ?? '').split('\n')[0]

    if (errors.length === 0) {
      if (warnings.length > 0) {
        lines.push('')
        lines.push(`Commit message accepted with warnings: "${header}"`)
        warnings.forEach(warning => lines.push(`  - ${hints[warning.name] ?? warning.message}`))
        lines.push('')
      }

      continue
    }

    lines.push('')
    lines.push(`Commit message rejected: "${header}"`)
    lines.push('')

    for (const error of errors) {
      lines.push(`  - ${hints[error.name] ?? error.message}`)
    }

    for (const warning of warnings) {
      lines.push(`  - (warning) ${hints[warning.name] ?? warning.message}`)
    }

    lines.push('')
    lines.push('Expected format: type(scope): description')
    lines.push('Examples:')
    lines.push('  feat(ui): add confetti button')
    lines.push('  fix(version): keep XSRF-TOKEN when clearing storage')
    lines.push('  chore: update dependencies')
    lines.push('Breaking change: add "!" (feat(ui)!: ...) or a "BREAKING CHANGE:" footer.')
    lines.push('')
  }

  return lines.join('\n')
}
