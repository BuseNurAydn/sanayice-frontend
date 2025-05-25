import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://ec2-18-199-84-187.eu-central-1.compute.amazonaws.com:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
