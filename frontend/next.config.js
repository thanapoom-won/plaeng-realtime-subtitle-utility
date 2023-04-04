/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'Permissions-Policy',
    value: 'microphone=(self)'
  }
]
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
