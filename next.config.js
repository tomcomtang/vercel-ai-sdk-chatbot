/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Enable static export
  images: {
    unoptimized: true  // Disable image optimization for static export
  },
  trailingSlash: true,  // Add trailing slash for better compatibility
};

module.exports = nextConfig;
