import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * Serves files from <project-root>/.apex/state/ at the URL path /.apex/state/.
 * Returns 404 when the file does not exist, 500 on read errors.
 * This lets useApexState() poll local state files written by Claude Code.
 */
function apexStatePlugin() {
  // Project root is two directories up from the showcase package.
  const stateDir = resolve(__dirname, "../../../.apex/state");

  return {
    name: "apex-state-server",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use("/.apex/state", (req, res, next) => {
        const url = (req as { url?: string }).url ?? "/";
        // Strip query string and leading slash to get the bare filename.
        const filename = url.split("?")[0].replace(/^\//, "");

        if (!filename) {
          res.statusCode = 400;
          res.end("Bad Request: missing filename");
          return;
        }

        // Guard against path traversal attacks.
        const filePath = resolve(stateDir, filename);
        if (!filePath.startsWith(stateDir)) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }

        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.end("Not Found");
          return;
        }

        try {
          const content = fs.readFileSync(filePath, "utf-8");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "no-store");
          res.statusCode = 200;
          res.end(content);
        } catch {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }

        void next; // satisfy linter — middleware must not call next() after responding
      });
    },
  };
}

export default defineConfig({
  server: { port: 3001 },
  plugins: [react(), tailwindcss(), apexStatePlugin()],
  resolve: {
    alias: {
      "@starters": resolve(__dirname, "../starters"),
      "@templates": resolve(__dirname, "../templates"),
      "@tokens": resolve(__dirname, "../tokens"),
      "@hub": resolve(__dirname, "../hub"),
    },
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
