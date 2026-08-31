/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the quiz can be served from GitHub Pages
  // under /ai-labs/cc4e-course/.
  output: "export",
  basePath: "/ai-labs/cc4e-course",
};

export default nextConfig;
