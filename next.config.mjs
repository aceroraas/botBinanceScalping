/** @type {import('next').NextConfig} */
const nextConfig = {
   env: {
      BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY,
      BINANCE_PUBLIC_KEY: process.env.BINANCE_PUBLIC_KEY,
      BINANCE_ENDPOINT_TEST: process.env.BINANCE_ENDPOINT_TEST,
   },
   async rewrites() {
      return [
         {
            source: '/api/:path*',
            destination: 'https://api.binance.com/api/v3/:path*',
         },
      ];
   },

};

export default nextConfig;
