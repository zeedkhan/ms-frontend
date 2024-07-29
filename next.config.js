/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "cdn4.iconfinder.com",
            },
            {
                hostname: "localhost"
            },
            {
                hostname: "storage.googleapis.com"
            }
        ]
    },
    webpack: (config, options) => {
        config.module.rules.push({
          test: /\.(pdf|html|csv)$/,
          type: "asset/resource",
        });
        return config;
      },
}

module.exports = nextConfig
