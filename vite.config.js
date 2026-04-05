import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/reddit': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/reddit/, ''),
        headers: {
          'User-Agent': 'TechPulse/1.0 (news aggregator)',
        },
      },
      '/api/producthunt': {
        target: 'https://www.producthunt.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/producthunt/, ''),
      },
    },
  },
})
