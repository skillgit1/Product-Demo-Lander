import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const root = fileURLToPath(new URL('.', import.meta.url))

// Reuses the demo's installed node_modules via a symlink, so we isolate this
// project's Vite cache to avoid colliding with the demo's optimizer cache.
export default defineConfig({
  cacheDir: './.vite',
  plugins: [react(), tailwindcss()],
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: { include: ['react', 'react-dom', 'react/jsx-runtime'] },
  // Multi-page build: the main landing page at the site root, and the
  // higher-ed page at /he/ (served as preview.tryskillwell.com/he).
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        he: resolve(root, 'he/index.html'),
      },
    },
  },
})
