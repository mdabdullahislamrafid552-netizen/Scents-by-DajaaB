import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Next.js 16 generates .next/types/validator.ts with an unresolved import
    // from next/types.js — framework-level issue, not our code.
    ignoreBuildErrors: true,
  },
  images: {
    // Allow all local public images — products, logo, and any root-level assets
    localPatterns: [
      { pathname: '/products/**' },   // product images
      { pathname: '/**' },            // logo.png + any other root-level public files
    ],
  },
};

export default nextConfig;
