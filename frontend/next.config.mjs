/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true, // Required for GitHub Pages
    },
    basePath: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/MyCalendar' : '',
    assetPrefix: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/MyCalendar/' : '',
  };
  
  export default nextConfig;
  