import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain njcoast.me → base is '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
