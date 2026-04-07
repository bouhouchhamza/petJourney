import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        // Keep /api prefix intact — backend routes already expect /api/*
        rewrite: (path) => path,
        // Surface the REAL error instead of a silent 502
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.error('\n🔴 PROXY ERROR:', err.message);
            if (err.code === 'ECONNREFUSED') {
              console.error('   → Backend is NOT running on :5000');
              console.error('   → Fix: open a new terminal and run:  node backend/server.js\n');
            }
            if (res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                message: 'Proxy error: Backend unreachable on :5000. Start it with: node backend/server.js',
              }));
            }
          });
        },
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
