/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
    //   typedRoutes: true,
    // },
    // typescript: {
    //   // !! WARN !!
    //   // Dangerously allow production builds to successfully complete even if
    //   // your project has type errors.
    //   // !! WARN !!
    //   ignoreBuildErrors: true,
    // },
    eslint: {
      ignoreDuringBuilds: true,
    },
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*',
          },
          {
            protocol: 'http',
            hostname: '*',
          },
        ],
      },
    };
    
    export default nextConfig;