import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

export function versionPlugin(): Plugin {
  const { version } = JSON.parse(readFileSync(path.resolve(import.meta.dirname, 'package.json'), 'utf8')) as { version: string }

  return {
    name: 'app-version',
    config: () => ({ define: { __APP_VERSION__: JSON.stringify(version) } }),
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version }) })
    },
  }
}
