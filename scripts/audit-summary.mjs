// Turns `pnpm audit --json` output into a compact Markdown report for issues and PR comments.
// GitHub rejects issue and comment bodies over 65,536 characters, and the raw audit table
// easily exceeds that, so this groups advisories by package and caps the output size.
// Usage: node scripts/audit-summary.mjs <audit.json> [run-url]
import { readFileSync } from 'node:fs'

const MAX_ROWS = 60
const MAX_LENGTH = 60_000
const SEVERITY_ORDER = ['critical', 'high', 'moderate', 'low', 'info']

const [file, runUrl] = process.argv.slice(2)

if (!file) {
  console.error('Usage: node scripts/audit-summary.mjs <audit.json> [run-url]')
  process.exit(1)
}

const audit = JSON.parse(readFileSync(file, 'utf8'))
const counts = audit.metadata?.vulnerabilities ?? {}
const advisories = Object.values(audit.advisories ?? {})
  .filter(advisory => advisory.severity === 'critical' || advisory.severity === 'high')

const packages = new Map()

for (const advisory of advisories) {
  const entry = packages.get(advisory.module_name) ?? {
    name: advisory.module_name,
    severity: advisory.severity,
    advisories: [],
    versions: new Set(),
    via: new Set(),
  }

  if (SEVERITY_ORDER.indexOf(advisory.severity) < SEVERITY_ORDER.indexOf(entry.severity)) {
    entry.severity = advisory.severity
  }

  entry.advisories.push(advisory)

  for (const finding of advisory.findings ?? []) {
    entry.versions.add(finding.version)

    for (const path of finding.paths ?? []) {
      const direct = path.split('>')[1]

      if (direct) entry.via.add(direct)
    }
  }

  packages.set(advisory.module_name, entry)
}

const rows = [...packages.values()].sort((a, b) =>
  SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  || b.advisories.length - a.advisories.length
  || a.name.localeCompare(b.name))

const summary = SEVERITY_ORDER
  .filter(severity => counts[severity])
  .map(severity => `${counts[severity]} ${severity}`)
  .join(' · ')

const lines = [
  '### Dependency audit: high/critical vulnerabilities found',
  '',
  `**Totals:** ${summary || 'none'}`,
]

if (runUrl) {
  lines.push('', `Full \`pnpm audit\` output: ${runUrl}`)
}

lines.push(
  '',
  '| Package | Severity | Advisories | Installed | Pulled in by |',
  '|---|---|---|---|---|',
)

let shown = 0

for (const row of rows.slice(0, MAX_ROWS)) {
  const first = row.advisories[0]
  const link = first.url ? `[${row.advisories.length}](${first.url})` : String(row.advisories.length)
  const via = [...row.via].slice(0, 3).join(', ') + (row.via.size > 3 ? ', …' : '')
  const line = `| \`${row.name}\` | ${row.severity} | ${link} | ${[...row.versions].join(', ')} | ${via} |`

  if (lines.join('\n').length + line.length > MAX_LENGTH) break

  lines.push(line)
  shown += 1
}

if (shown < rows.length) {
  lines.push('', `_${rows.length - shown} more package(s) omitted. See the full output in the run._`)
}

lines.push('', 'Fix: update the packages in "Pulled in by", or add an `overrides` entry in pnpm-workspace.yaml for transitive ones.')

console.log(lines.join('\n'))
