import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // We keep your existing settings here
  experimental: {
    reactCompiler: true, // Note: In Next.js 15, this usually lives inside 'experimental'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

// Wrap the config with the translation plugin
export default withNextIntl(nextConfig);
