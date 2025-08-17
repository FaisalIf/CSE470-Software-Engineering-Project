import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Prevent ESLint errors from failing production builds (Vercel)
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["images.unsplash.com", "cdn.pixabay.com"],
  },
};

export default nextConfig;
