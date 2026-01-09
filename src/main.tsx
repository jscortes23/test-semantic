import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { checkAndHandleVersionChange, getCurrentVersion } from './utils/versionManager'

// Verificar y manejar el cambio de versión antes de renderizar la app
const currentVersion = getCurrentVersion()
checkAndHandleVersionChange(currentVersion)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
