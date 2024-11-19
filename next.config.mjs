/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bluehippo-leopoldxing.s3.ca-central-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "localhost"
      },
      {
        protocol: "http",
        hostname: "localstack"
      },
      {
        protocol: "https",
        hostname: "bluehippo-production.up.railway.app"
      }
    ]
  }
};

export default nextConfig;
