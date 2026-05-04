import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${new URL(process.env.R2_PUBLIC_URL!).hostname}`
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