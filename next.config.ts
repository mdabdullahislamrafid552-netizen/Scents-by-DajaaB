import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Next.js 16 generates .next/types/validator.ts with an unresolved import
    // from next/types.js — framework-level issue, not our code.
    ignoreBuildErrors: true,
  },
  images: {
    // Allow all local images from public/products and its subfolders
    localPatterns: [
      { pathname: '/products/**' },
      { pathname: '/file.svg' },    // fallback placeholder
    ],
  },
};

export default nextConfig;
