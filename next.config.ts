import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://baobun.dev',
        // 307 — swap to `true` for a 308 once the move is final.
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
