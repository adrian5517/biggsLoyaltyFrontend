/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        // Whenever your frontend calls /api/proxy/...,
        source: '/api/proxy/:path*',
        // Next.js will secretly fetch it from here and return the data
        destination: 'https://biggsph.com/biggsLoyaltyPHP/api/:path*',
      },
      // {
      //   source: '/api/external/:path*',
      //   destination: 'https://biggsph.com/biggsLoyaltyPHP/api/:path*',
      // },
    ]
  },
}

export default nextConfig