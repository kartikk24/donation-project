import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // 👈 THIS makes @/... work
  ],
  server: {
    proxy: {
     "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
      // rewrite: (path) => path.replace(/^\/api/, ""), // remove `/api` prefix
    },
    },
  },
});
