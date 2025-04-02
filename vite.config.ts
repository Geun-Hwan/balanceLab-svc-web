import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },

  build: {
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000, // 청크 크기 경고 기준 상향 조정
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"], // 주요 라이브러리 분리
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      "@asset": path.resolve(__dirname, "./src/assets"),
      "@img": path.resolve(__dirname, "./src/assets/images"),

      "@tmp": path.resolve(__dirname, "./src/elements/templates"),
      "@cmp": path.resolve(__dirname, "./src/elements/components"),

      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },

  server: {
    port: 3000, // CRA 기본 포트 맞춤
    open: true,
  },
});
