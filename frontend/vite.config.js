import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 👇 ADDED THIS SECTION
  server: {
    port: 5173,      // Force the server to use port 5173
    strictPort: true, // If 5173 is in use, crash instead of switching to 5174
  }
})