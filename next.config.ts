import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        // Enable experimental features if needed
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },
    images: {
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60,
    },
    async headers() {
        return [
            {
                source: '/_next/static/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/assets/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
        ];
    },
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    // Remove dangerous error ignoring settings
    // eslint: {
    //   ignoreDuringBuilds: true // This should be false in production
    // },
    // typescript: {
    //   ignoreBuildErrors: true // This should be false in production
    // }
};

export default nextConfig;
