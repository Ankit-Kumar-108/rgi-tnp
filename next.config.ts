import type { NextConfig } from "next";

const nextConfig: NextConfig = {
};

if (process.env.NODE_ENV === "development") {
  const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");
  setupDevPlatform();
}

export default nextConfig;
