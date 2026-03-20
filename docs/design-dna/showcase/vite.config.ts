import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  server: { port: 3001 },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@starters": resolve(__dirname, "../starters"),
      "@templates": resolve(__dirname, "../templates"),
      "@tokens": resolve(__dirname, "../tokens"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
});
