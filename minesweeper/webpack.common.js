const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][ext]'
    },
    performance: {
        hints: false
    },
    resolve: {
    extensions: ['.js', '.json']
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            { oneOf: [
                {
                    test: /\.(png|jpe?g|webp|svg|gif)$/,
                    type: 'asset/resource',
                    // generator: {
                    //     filename: '[name][ext]',
                    //     outputPath: 'assets/img/'
                    // }
                },
                {
                    test: /\.svg$/,
                    type: "asset/inline",
                    resourceQuery: /inline/,
                },
            ]},
              {
                test: /\.(mp3|wav)$/,
                type: 'asset/resource',
                // generator: {
                //     filename: '[name][ext]',
                //     outputPath: 'assets/sounds/'
                // }
              },
        ],
    },
}