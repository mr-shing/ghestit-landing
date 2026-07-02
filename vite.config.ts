import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icons/apple-touch-icon.png', 'logoghestit.png'],
        manifest: {
          id: '/',
          name: 'قسطیت | مدیریت و پرداخت اقساط',
          short_name: 'قسطیت',
          description: 'مدیریت اقساط، پرداخت آنلاین اقساط و اعتبارسنجی برای کسب‌وکارها',
          lang: 'fa-IR',
          dir: 'rtl',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait',
          theme_color: '#02A958',
          background_color: '#fafafa',
          categories: ['finance', 'business'],
          icons: [
            {src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
            {src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
            {src: 'icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable'},
            {src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
          navigateFallback: '/index.html',
          // Never cache API responses in the SW; the app owns its own fetching.
          // /downloads holds real binaries (APK) — SPA fallback must not swallow them.
          navigateFallbackDenylist: [/^\/api/, /^\/downloads\//, /^\/\.well-known\//],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
     preview: {
       allowedHosts: ['ghestit.com', 'www.ghestit.com'],
       port: 3008,
       host: '127.0.0.1'
     }
  };
});
