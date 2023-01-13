const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = {
    entry: {
        'gaia-community-chat-lib': './src/main.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        extensionAlias: {
            ".js": [".js", ".ts"],
        },
        fallback: {
            url: require.resolve("url/"),
            os: require.resolve("os-browserify/browser"),
            http: require.resolve("http-browserify"),
            https: require.resolve("https-browserify"),
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert/"),
            crypto: require.resolve("crypto-browserify"),
            util: require.resolve("util/"),
            buffer: require.resolve("buffer/")
        },
    },
    output: {
        filename: '[name]-0.0.1.js',
        path: __dirname,
    },
    plugins: [
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
};