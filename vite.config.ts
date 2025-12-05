import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    historyApiFallback: true,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - load first
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // Router - needed for navigation
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // Framer Motion - heavy, defer if possible
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // UI Components - load on demand
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui';
          }
          // Supabase - load on demand
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Forms - load on demand
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform') || id.includes('node_modules/zod')) {
            return 'vendor-forms';
          }
          // Query - load on demand
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-query';
          }
          // Three.js - very heavy, separate chunk
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
          // Charts/Analytics - heavy
          if (id.includes('node_modules/recharts') || id.includes('node_modules/@tremor')) {
            return 'vendor-charts';
          }
          // Animation libraries - heavy
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lottie')) {
            return 'vendor-animations';
          }
          // Lucide icons - commonly used
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Date utilities
          if (id.includes('node_modules/date-fns')) {
            return 'vendor-date';
          }
          // Other node_modules
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name ? assetInfo.name.split('.') : ['asset'];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return 'images/[name]-[hash][extname]';
          }
          if (/css/i.test(ext)) {
            return 'css/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return 'fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    cssCodeSplit: true,
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 4096, // Inline small assets
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    exclude: []
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  define: {
    global: 'globalThis',
  }
}));
