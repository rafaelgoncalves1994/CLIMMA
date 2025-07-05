import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,            // <--- necessário para acesso externo
    port: 5173,
    strictPort: true
  }
})
