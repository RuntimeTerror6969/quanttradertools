import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['quanttradertools.github.io'],
  },
};

export default nextConfig;
