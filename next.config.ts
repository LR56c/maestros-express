import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://rnhtqsrcybvntugmpltw.supabase.co/**')],
  },
};

export default nextConfig;
