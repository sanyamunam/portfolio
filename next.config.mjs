const isProd = process.env.NODE_ENV === 'production';

/* Deployed as a GitHub Pages project site at sanyamunam.github.io/portfolio */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/portfolio' : '',
  assetPrefix: isProd ? '/portfolio' : '',
};

export default nextConfig;
