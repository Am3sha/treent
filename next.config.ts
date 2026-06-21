import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "*.space-z.ai",
    "*.chatglm.cn",
    "preview-chat-c8b2718b-b8fb-4364-99fa-111afc016e2e.space-z.ai",
  ],
};

export default nextConfig;
