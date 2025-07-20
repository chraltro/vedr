import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "Markweavia"; // Replace with your repository name if it's different from "Markweavia"

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export", // Essential for static export
  distDir: "out", // Output directory for the static build
  // Configure basePath and assetPrefix for GitHub Pages
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: {
    unoptimized: true, // Needed for static export if you use next/image
  },
};

export default nextConfig;