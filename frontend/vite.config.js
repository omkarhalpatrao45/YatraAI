import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:8000',
      '/trips': 'http://localhost:8000',
      '/weather': 'http://localhost:8000',
      '/expenses': 'http://localhost:8000',
    }
  }
})
