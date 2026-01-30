import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Cek-Takip/', // GitHub Pages için repository adı
  server: {
    host: '0.0.0.0', // Tüm ağ arayüzlerinde dinle
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
  publicDir: 'public',
})
