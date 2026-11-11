export async function fetchRemoteVersion() {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })

    if (!response.ok) return null

    const data: unknown = await response.json()

    if (typeof data === 'object' && data !== null && 'version' in data && typeof data.version === 'string') {
      return data.version
    }

    return null
  } catch {
    return null
  }
}
