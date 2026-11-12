import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { versionPlugin } from './versionPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionPlugin()],
})
