import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: {
    // This app lives under a parent folder that also has a package-lock.json.
    // Pin Turbopack's root to this app so CSS/module resolution doesn't escape
    // to /Users/macbook/projets-web and fail to resolve this app's dependencies.
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
