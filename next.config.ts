import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// *** CHANGE THIS LINE ***
const repoName = "mdpresentation";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  distDir: "out",
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;