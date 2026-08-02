import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  server : {
    host : '127.0.0.1',
    proxy : {
      '/api' : {
        target : 'http://127.0.0.1:4000',
        changeOrigin : true
      },
      '/auth' : {
        target : 'http://127.0.0.1:4000',
        changeOrigin : true
      }
    }
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
