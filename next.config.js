

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'help-desk-dev.s3.ap-south-1.amazonaws.com',
            },
        ],
    },

}

module.exports = nextConfig
