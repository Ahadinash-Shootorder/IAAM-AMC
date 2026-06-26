/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only allow images served from the same origin (locally uploaded assets
    // under /public/uploads/ and the public/ static directory). Wildcard
    // hostnames previously allowed any HTTP(S) source, which combined with
    // admin-controlled image fields enables SSRF / bandwidth abuse via the
    // Next image optimizer. Add specific hosts here only if you need them.
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent the site from being embedded in iframes (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Restrict referrer info sent to third-party sites
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Remove the X-Powered-By header so the stack isn't revealed
          { key: 'X-Powered-By', value: '' },
          // Basic permissions policy — disable unnecessary browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // Strict-Transport-Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
