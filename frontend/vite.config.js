import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // السماح بمعالجة صور ذات امتدادات أحرف كبيرة كأصول ثابتة
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG', '**/*.WEBP'],
  server: {
    port: 3000,
    open: true,
  },
})
