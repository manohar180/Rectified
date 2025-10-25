import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://your-backend-name.onrender.com'  // Replace with your Render URL
          : 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})


