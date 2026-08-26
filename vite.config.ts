import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Reuses the demo's installed node_modules via a symlink, so we isolate this
// project's Vite cache to avoid colliding with the demo's optimizer cache.
export default defineConfig({
  cacheDir: './.vite',
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: { include: ['react', 'react-dom', 'react/jsx-runtime'] },
})
