import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// vite.config.js
// The proxy setting means any fetch/axios call to "/api/..." in React
// is silently forwarded to "http://localhost:8000/..." by Vite's dev server.
// This avoids CORS issues during development — the browser thinks
// everything is coming from the same origin (localhost:5173).

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,       // React dev server port
    proxy: {
      // Any request starting with /api gets rewritten and forwarded to FastAPI
      "/api": {
        target: "http://localhost:8000",   // FastAPI backend address
        changeOrigin: true,                // Adjusts the Host header
        rewrite: (path) => path.replace(/^\/api/, ""),
        // Example: GET /api/chat  →  GET http://localhost:8000/chat
      },
    },
  },
});
