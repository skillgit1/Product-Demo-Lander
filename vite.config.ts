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
  // Multi-page build: the main landing page at the site root, plus the
  // vertical pages at /he/ (higher ed), /cbe/ (CBE / Direct Assessment),
  // /devlearn/ (DevLearn 2026 event-exclusive pricing page),
  // /conversational-sims/ (product page for the conversational sims launch,
  // temporary standalone home until it moves onto skillwell.com proper), and
  // /learning-portfolio-beta/ (Skillwell Verify skills report design rebuild).
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        he: resolve(root, 'he/index.html'),
        cbe: resolve(root, 'cbe/index.html'),
        devlearn: resolve(root, 'devlearn/index.html'),
        // PULLED 2026-11-24: /conversational-sims taken offline pending rights
        // clearance on the embedded sim (embed.liveavatar.com, see
        // ConversationalSimsPage.tsx) and the new embed code from product. All
        // source files are kept intact — uncomment this line and redeploy to
        // bring the page back (swap in the new embed first).
        // conversationalSims: resolve(root, 'conversational-sims/index.html'),
        learningPortfolioBeta: resolve(root, 'learning-portfolio-beta/index.html'),
      },
    },
  },
})
