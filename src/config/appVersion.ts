export const APP_VERSION = __APP_VERSION__
export const APP_VERSION_STORAGE_KEY = 'app-version'

function parseVersion(version: string) {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version)

  return match ? { major: match[1], minor: match[2] } : null
}

export function shouldClearStorage(previous: string, next: string, mode: string) {
  if (previous === next) return false
  if (mode === 'staging') return true

  const from = parseVersion(previous)
  const to = parseVersion(next)

  if (!from || !to) return true

  return from.major !== to.major || from.minor !== to.minor
}
