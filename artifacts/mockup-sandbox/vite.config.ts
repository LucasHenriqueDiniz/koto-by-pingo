import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";

// PORT is read only by `server` and `preview` below — a production build writes
// files and never binds a port. Demanding it at module load made `vite build`
// throw in every environment that does not inject PORT, which is every one
// except Replit. It stays authoritative when present: an unparseable value is
// still a hard error, and the server options below are applied exactly as before.
const rawPort = process.env.PORT;
const port = rawPort === undefined ? undefined : Number(rawPort);

if (port !== undefined && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// BASE_PATH does reach the build: it becomes vite's `base`, the prefix on every
// emitted asset URL. It defaults to "/" because that is what a site served from
// a domain root needs, which is how this deploys on Cloudflare Pages. Set it
// explicitly to serve from a sub-path.
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,
  plugins: [
    mockupPreviewPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    ...(port === undefined ? {} : { port }),
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    ...(port === undefined ? {} : { port }),
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
