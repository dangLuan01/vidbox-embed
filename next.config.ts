import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  productionBrowserSourceMaps: false,
  compress: true,
  reactStrictMode: true,

  experimental: {
    serverActions: { 
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
