import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Produces .next/standalone for a minimal Docker image.
  // Vercel ignores this — safe to leave on.
  output: 'standalone',
  images: {
    remotePatterns: [new URL('https://image.tmdb.org/t/p/**')],
  },
};

export default nextConfig;
