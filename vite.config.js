import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api/santa-availability': 'http://127.0.0.1:18080',
    },
    allowedHosts: [
      'fergus.local',
    ]
  }
})
