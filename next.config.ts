import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "heimstadt.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Vercel-compatible — no path imports, no __dirname usage
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We'll fix all type issues, but don't block deploy
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
