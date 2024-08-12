/** @type {import('next').NextConfig} */

const CopyPlugin = require('copy-webpack-plugin');

const wasmPaths = [
    "./node_modules/onnxruntime-web/dist/ort-wasm.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-simd.jsep.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
    "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.jsep.wasm",
    "./node_modules/onnxruntime-web/dist/ort-training-wasm-simd.wasm",
];

const vadModelFiles = [
    "./node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
    "./node_modules/@ricky0123/vad-web/dist/silero_vad.onnx",
];

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
    webpack: (config, { }) => {
        config.resolve.extensions.push(".ts", ".tsx");
        config.resolve.fallback = { fs: false };
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    ...wasmPaths.map((path) => ({
                        from: path,
                        to: "static/chunks",
                    })),
                    ...vadModelFiles.map((path) => ({
                        from: path,
                        to: "static/chunks",
                    })),
                ],
            })
        )
        config.module.rules.push({
            test: /\.(pdf|html|csv)$/,
            type: "asset/resource",
        });
        return config;
    },
}

module.exports = nextConfig;