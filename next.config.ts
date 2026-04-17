import type { NextConfig } from "next";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(o => o.trim());

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: allowedOrigins[0] },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, x-environment, x-api-key" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },
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
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;