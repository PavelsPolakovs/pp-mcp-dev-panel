import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@store': resolve(__dirname, 'src/store'),
      '@ws': resolve(__dirname, 'src/ws'),
      '@css': resolve(__dirname, 'src/css'),
      '@config': resolve(__dirname, 'src/config'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@atoms': resolve(__dirname, 'src/components/atoms'),
      '@molecules': resolve(__dirname, 'src/components/molecules'),
      '@organisms': resolve(__dirname, 'src/components/organisms'),
      '@pages': resolve(__dirname, 'src/components/pages')
    }
  },
  build: { outDir: 'dist' }
})
