import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //   reactStrictMode: true,
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
};

export default nextConfig;


