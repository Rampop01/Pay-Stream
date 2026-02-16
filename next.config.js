/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@stacks/connect',
    '@stacks/transactions',
    '@stacks/network',
    'x402-stacks',
  ],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: chrome-extension:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "connect-src *",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https: chrome-extension:",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
