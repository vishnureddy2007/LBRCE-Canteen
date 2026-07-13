import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const base = isVercel ? '/' : (isGitHubActions || process.env.GH_PAGES === 'true' ? '/LBRCE-Canteen/' : '/');

// Vite dev server config — proxies /api requests to the Spring Boot backend
// during development. In production the frontend is served from the same
// origin as the API or via a CDN.
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});