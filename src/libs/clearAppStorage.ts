// Add the localStorage key prefixes that must survive a cleanup (e.g. the auth session key).
const PRESERVED_STORAGE_PREFIXES: string[] = []
const PRESERVED_COOKIES = ['XSRF-TOKEN']

function clearCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim()

    if (!name || PRESERVED_COOKIES.includes(name)) return

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })
}

async function clearBrowserCaches() {
  if ('caches' in window) {
    const keys = await caches.keys()

    await Promise.all(keys.map(key => caches.delete(key)))
  }

  if ('indexedDB' in window && typeof indexedDB.databases === 'function') {
    const databases = await indexedDB.databases()

    databases.forEach((database) => {
      if (database.name) indexedDB.deleteDatabase(database.name)
    })
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()

    await Promise.all(registrations.map(registration => registration.unregister()))
  }
}

export async function clearAppStorage() {
  const preserved = Object.entries(localStorage)
    .filter(([key]) => PRESERVED_STORAGE_PREFIXES.some(prefix => key.startsWith(prefix)))

  localStorage.clear()
  sessionStorage.clear()
  preserved.forEach(([key, value]) => localStorage.setItem(key, value))
  clearCookies()

  try {
    await clearBrowserCaches()
  } catch {
    return
  }
}
