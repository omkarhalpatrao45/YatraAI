import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react/')) return 'react-core'
          if (id.includes('react-router-dom')) return 'react-router'
          if (id.includes('leaflet')) return 'maps'
          if (id.includes('jspdf')) return 'pdf'
          if (id.includes('lucide-react') || id.includes('react-hot-toast')) return 'ui'
          if (id.includes('axios')) return 'http'
        }
      }
    }
  },
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
