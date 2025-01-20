/** @type {import('next').NextConfig} */
const nextConfig = {
    output: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? 'export' : undefined,
    images: {
      unoptimized: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages',  // Required for exporting images
    },
    basePath: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/MyCalendar' : '',
    assetPrefix: process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'gh-pages' ? '/MyCalendar/' : '',
};

export default nextConfig;
