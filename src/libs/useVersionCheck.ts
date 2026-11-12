import { APP_VERSION, APP_VERSION_STORAGE_KEY, shouldClearStorage } from '../config/appVersion'
import { clearAppStorage } from './clearAppStorage'
import { fetchRemoteVersion } from '../services/versionService'
import { useEffect, useState } from 'react'

const CHECK_INTERVAL_MS = 5 * 60_000

async function syncStoredVersion() {
  const stored = localStorage.getItem(APP_VERSION_STORAGE_KEY)

  if (stored && shouldClearStorage(stored, APP_VERSION, import.meta.env.MODE)) {
    await clearAppStorage()
  }

  localStorage.setItem(APP_VERSION_STORAGE_KEY, APP_VERSION)
}

/**
 * Syncs the stored version on startup and polls /version.json.
 * Returns the newer remote version when one is available, otherwise null.
 */
export function useVersionCheck() {
  const [availableVersion, setAvailableVersion] = useState<string | null>(null)

  useEffect(() => {
    void syncStoredVersion()

    const checkRemoteVersion = async () => {
      const remote = await fetchRemoteVersion()

      if (remote && remote !== APP_VERSION) setAvailableVersion(remote)
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') void checkRemoteVersion()
    }
    const interval = window.setInterval(() => void checkRemoteVersion(), CHECK_INTERVAL_MS)

    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return availableVersion
}
