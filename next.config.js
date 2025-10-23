/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  images: {
    domains: ['via.placeholder.com', 'localhost']
  }
};

module.exports = nextConfig;

