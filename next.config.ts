import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : undefined,
  basePath: isGithubPages ? "/anf" : "",
  assetPrefix: isGithubPages ? "/anf/" : undefined,
  images: {
    unoptimized: true, // required for static export
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
