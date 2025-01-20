/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enables static export
  images: {
    unoptimized: true,  // Required for exporting images in static mode
  },
  basePath: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/MyCalendar' : '',
  assetPrefix: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/MyCalendar/' : '',
};

export default nextConfig;
