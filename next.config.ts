import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // Type checking is done locally — skip during Vercel build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
