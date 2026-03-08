import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // 👈 mobile / network access allow
    port: 5171       // 👈 tumhara current port
  }
})
