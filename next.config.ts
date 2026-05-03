import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.R2_BUCKET_NAME}`
      },
    ],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), '@sparticuz/chromium'];
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
    serverComponentsExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
  // eslint: {
  //   ignoreDuringBuilds: true, // TODO: remove and fix linting errors
  // },
};

export default nextConfig;