import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables stricter checks and warnings for the React code inside your application
  reactStrictMode: true, 

  images: {
    // Defines the allowed external domains for images
    domains: ['images.unsplash.com'],
    // Optional: Add the remotePatterns field for greater security and flexibility
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'images.unsplash.com',
    //     port: '',
    //     pathname: '/photo-**',
    //   },
    // ],
  },

  // Configuration for the build output
  output: 'standalone', // Recommended for deployment on Docker/Node environments

  // Add TypeScript compiler options
  typescript: {
    // Setting this to true is generally recommended for production stability
    ignoreBuildErrors: false, 
  },

  eslint: {
    // !! WARNING: This allows production builds to successfully complete even if
    // your project has ESLint errors. Use this option only if you are confident
    // in your testing and quality assurance process.
    ignoreDuringBuilds: true,
  },
  
  // Enable source maps in production for better debugging/error reporting tools
  productionBrowserSourceMaps: true,

  // --- CORRECTION: REMOVE INCORRECT TURBOPACK CONFIGURATION ---
  // The 'experimental' block for disabling turbo is incorrect and unnecessary.
  // Turbopack is enabled/disabled via the 'next dev/build --turbo' command line flag.
  // Since the flag is what causes the issue, we just remove the custom config here.
  //
  // experimental: {
  //   turbo: {
  //     rules: false
  //   }
  // }, 
};

export default nextConfig;