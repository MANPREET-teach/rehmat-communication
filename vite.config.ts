import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'github-pages' ? '/rehmat-communication/' : '/',
  build: {
    outDir: 'dist',
  },
  plugins: [react({ jsxRuntime: 'automatic' })],
}))
