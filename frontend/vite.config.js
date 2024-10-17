import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change the port to 3000
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend runs on port 4000
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: 'index.html',
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group all node_modules into a separate vendor chunk
            return 'vendor'
          }
        },
      },
    },
  },
})
