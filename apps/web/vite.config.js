import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack/react-query'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-animations': ['gsap', 'framer-motion', 'lenis'],
          'vendor-ui': ['lucide-react', 'recharts', 'canvas-confetti'],
        },
      },
    },
  },
});
