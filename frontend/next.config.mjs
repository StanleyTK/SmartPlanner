/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Enable static export for deployment
    images: {
      unoptimized: true,  // Required for exporting images in static mode
    },
    basePath: '/MyCalendar',  // Set this to your GitHub repo name
    assetPrefix: '/MyCalendar/',  // Prefix for static assets
  };
  
  export default nextConfig;
  