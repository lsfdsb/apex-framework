/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@starters": resolve(__dirname, "../starters"),
      "@templates": resolve(__dirname, "../templates"),
      "@tokens": resolve(__dirname, "../tokens"),
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
