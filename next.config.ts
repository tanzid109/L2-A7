import type { NextConfig } from "next";

const API_PROXY_TARGET = process.env.API_PROXY_TARGET;

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    if (!API_PROXY_TARGET) {
      return [];
    }

    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY_TARGET}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
