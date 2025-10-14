// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "vedr";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  distDir: "out",
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : "",
  },
};

export default nextConfig;