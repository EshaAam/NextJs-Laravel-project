import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ NEW: Configure Next.js to allow images from Laravel backend
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**', // Allow images from Laravel storage
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**', // Allow images from localhost
      },
    ],
  },
};

export default nextConfig;
