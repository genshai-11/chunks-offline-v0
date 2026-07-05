import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // allow access from LAN and Cloudflare Tunnel
    allowedHosts: [
      'amendments-joins-tuning-ala.trycloudflare.com',
      '.trycloudflare.com', // allow any quick tunnel from Cloudflare
      'localhost',
    ],
    // HMR configured for the current Cloudflare tunnel (update if tunnel URL changes)
    hmr: {
      host: 'amendments-joins-tuning-ala.trycloudflare.com',
      protocol: 'wss',
      clientPort: 443,
    },
  },
})
