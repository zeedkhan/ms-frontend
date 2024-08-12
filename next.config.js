/** @type {import('next').NextConfig} */

const fs = require("node:fs/promises");
const path = require("node:path");

const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp' // or 'credentialless' depending on your needs
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin'
                    },
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'cross-origin'
                    },
                ],
            },
        ];
    },
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

async function copyFiles() {
    try {
        await fs.access("public/");
    } catch {
        await fs.mkdir("public/", { recursive: true });
    }

    const wasmFiles = (
        await fs.readdir("node_modules/onnxruntime-web/dist/")
    ).filter((file) => path.extname(file) === ".wasm");

    await Promise.all([
        fs.copyFile(
            "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
            "public/vad.worklet.bundle.min.js"
        ),
        fs.copyFile(
            "node_modules/@ricky0123/vad-web/dist/silero_vad.onnx",
            "public/silero_vad.onnx"
        ),
        ...wasmFiles.map((file) =>
            fs.copyFile(
                `node_modules/onnxruntime-web/dist/${file}`,
                `public/${file}`
            )
        ),
    ]);
}

copyFiles();

module.exports = nextConfig;