import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')

if (process.env.CI || !existsSync(path.join(root, '.git'))) {
  process.exit(0)
}

execSync('git config core.hooksPath .husky', { cwd: root, stdio: 'inherit' })
