import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.R2_BUCKET_NAME}`
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Match your client-side guardrail
    },
  },
};

export default nextConfig;
