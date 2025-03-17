import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true
      },
      {
        source: "/inicio",
        destination: "/inicio/departamentos",
        permanent: true
      }
    ]
  }
};

export default nextConfig;
