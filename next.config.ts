import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Pin Turbopack root to this app (not the parent folder with a stray lockfile).
// `process.cwd()` can still resolve `tailwindcss` from the wrong `package.json` in dev.
const appRoot = path.dirname(fileURLToPath(import.meta.url));
const tailwindEntry = path.join(appRoot, "node_modules/tailwindcss/index.css");

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
    resolveAlias: {
      // Bare import "tailwindcss" (e.g. from tooling) → app install, not parent monorepo root
      tailwindcss: tailwindEntry,
    },
  },
};

export default nextConfig;
