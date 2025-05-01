import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    // Ensure minified files are copied to the dist directory
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: '[name].min.js',
        chunkFileNames: '[name].min.js',
        assetFileNames: '[name].min.[ext]'
      }
    },
    // Copy the src directory to dist during build
    emptyOutDir: true
  }
})
