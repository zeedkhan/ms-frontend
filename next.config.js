/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "cdn4.iconfinder.com",
            },
            {
                hostname: "localhost"
            }
        ]
    },
    output: "standalone",
}

module.exports = nextConfig
