import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS ? "/My-Portfolio" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
