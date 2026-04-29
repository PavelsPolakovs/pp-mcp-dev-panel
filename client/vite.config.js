import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@store': resolve(__dirname, 'src/store'),
      '@css': resolve(__dirname, 'src/css'),
      '@atoms': resolve(__dirname, 'src/components/atoms'),
      '@molecules': resolve(__dirname, 'src/components/molecules'),
      '@organisms': resolve(__dirname, 'src/components/organisms'),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3333",
      "/ws": { target: "ws://localhost:3333", ws: true },
    },
  },
  build: { outDir: "dist" },
});
