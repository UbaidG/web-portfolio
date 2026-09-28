import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/web-portfolio/',
  build: {
    // Three.js is intentionally bundled eagerly so the hero models render without a lazy-load delay.
    chunkSizeWarningLimit: 1200,
  },
})
