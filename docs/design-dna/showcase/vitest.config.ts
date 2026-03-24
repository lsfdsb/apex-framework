/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow Vite to serve files from the starters/templates siblings
      allow: [resolve(__dirname, ".."), __dirname],
    },
  },
  resolve: {
    alias: {
      "@starters": resolve(__dirname, "../starters"),
      "@templates": resolve(__dirname, "../templates"),
      "@tokens": resolve(__dirname, "../tokens"),
      // Ensure test utilities resolve from showcase node_modules for files
      // living outside the project root (starters/, templates/)
      "@testing-library/react": resolve(__dirname, "node_modules/@testing-library/react"),
      "@testing-library/jest-dom": resolve(__dirname, "node_modules/@testing-library/jest-dom"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "../starters/**/*.test.{ts,tsx}", "../templates/**/*.test.{ts,tsx}"],
    css: true,
  },
});
