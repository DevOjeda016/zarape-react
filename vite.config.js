import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['img/**/*', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'El Zarape',
        short_name: 'El Zarape',
        description: 'Menú y pedidos de El Zarape',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#b3261e',
        background_color: '#fbf5ea',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,webp,ico}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Solo catálogo público: menú y categorías. Auth, me y pedidos nunca se cachean.
            urlPattern: ({ url, request }) =>
              request.method === 'GET' && /\/api\/(products|categories)(\/|$|\?)/.test(url.pathname + url.search),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'zarape-api-catalogo',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
  server: { port: 5173 },
})
