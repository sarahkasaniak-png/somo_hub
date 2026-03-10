// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Uncomment if you need these
  // reactStrictMode: true,
  // swcMinify: true,
  
  async redirects() {
    return [
      {
        source: '/webmail',
        destination: 'https://business130.web-hosting.com:2096/webmaillogout.cgi', 
        permanent: false, 
      },
    ];
  },
  
  // Add this to ensure trailing slashes don't break routes
  trailingSlash: false,
  
  // Ensure these routes are properly handled
  async headers() {
    return [
      {
        source: '/payment/callback',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/onboarding/tutor/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;