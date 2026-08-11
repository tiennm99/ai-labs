import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the quiz can be served from GitHub Pages
  // under /ai-coding-workflow-labs/cc4e-course/.
  output: "export",
  basePath: "/ai-coding-workflow-labs/cc4e-course",
};

export default nextConfig;
