import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['utfs.io'], // 👈 Add allowed image hostnames here
  },
};

export default nextConfig;

