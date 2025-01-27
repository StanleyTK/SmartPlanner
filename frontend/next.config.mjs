/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  basePath: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/SmartPlanner' : '',
  assetPrefix: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/SmartPlanner/' : '',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
};

export default nextConfig;
