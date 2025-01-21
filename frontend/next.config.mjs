/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true, // Required for GitHub Pages
    },
    basePath: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/SmartPlanner' : '',
    assetPrefix: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/SmartPlanner/' : '',
  };
  
  export default nextConfig;
  