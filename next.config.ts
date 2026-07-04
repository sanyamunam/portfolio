import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages. The site is one fully static page; the
  // Pages workflow (actions/configure-pages with static_site_generator:
  // "next") injects basePath for project-page URLs automatically. All
  // public-asset references in content.ts are RELATIVE (media/…,
  // prompt-playbook.html) so they resolve under any base path.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
