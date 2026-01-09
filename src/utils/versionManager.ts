/**
 * Utilidad para gestionar la verificación de versión y limpieza de datos
 * cuando cambia la versión de la aplicación
 */

const VERSION_STORAGE_KEY = "__app_version__";

/**
 * Limpia el cache del navegador
 */
function clearCache(): void {
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
}

/**
 * Limpia todas las cookies del dominio actual
 */
function clearCookies(): void {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    // Eliminar cookie estableciendo su expiración en el pasado
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
  });
}

/**
 * Limpia todo el localStorage
 */
function clearLocalStorage(): void {
  localStorage.clear();
}

/**
 * Obtiene la versión almacenada en localStorage
 */
function getStoredVersion(): string | null {
  return localStorage.getItem(VERSION_STORAGE_KEY);
}

/**
 * Guarda la versión actual en localStorage
 */
function saveVersion(version: string): void {
  localStorage.setItem(VERSION_STORAGE_KEY, version);
}

/**
 * Verifica si la versión ha cambiado y realiza la limpieza si es necesario
 * @param currentVersion - Versión actual de la aplicación (desde package.json)
 * @returns true si la versión cambió y se realizó limpieza, false en caso contrario
 */
export function checkAndHandleVersionChange(currentVersion: string): boolean {
  const storedVersion = getStoredVersion();

  // Si no hay versión almacenada, es la primera vez que se ejecuta
  // Guardamos la versión actual sin limpiar
  if (!storedVersion) {
    saveVersion(currentVersion);
    return false;
  }

  // Si la versión es diferente, necesitamos limpiar
  if (storedVersion !== currentVersion) {
    console.log(
      `[Version Manager] Versión cambió de ${storedVersion} a ${currentVersion}. Limpiando datos...`
    );

    // Limpiar en este orden:
    // 1. localStorage (pero guardamos la versión anterior primero en una variable temporal)
    clearLocalStorage();

    // 2. Cookies
    clearCookies();

    // 3. Cache
    clearCache();

    // 4. Guardar la nueva versión después de limpiar
    saveVersion(currentVersion);

    console.log(
      "[Version Manager] Limpieza completada. Nueva versión guardada."
    );

    return true;
  }

  return false;
}

/**
 * Obtiene la versión actual de la aplicación
 * Esta función debe ser llamada con la versión inyectada por Vite
 */
export function getCurrentVersion(): string {
  return typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "0.0.0";
}
