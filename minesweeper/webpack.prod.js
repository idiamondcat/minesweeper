const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
        filename: './css/[name].css'
    }),
    // new CopyPlugin({
    //     patterns: [
    //       { from: path.resolve(__dirname, './src/img'), to: path.resolve(__dirname, 'dist/assets/img') },
    //       {from: path.resolve(__dirname, './src/sounds'), to: path.resolve(__dirname, 'dist/assets/sounds') }
    //     ],
    //   }),
  ],
  module: {
    rules: [
        {
            test: /\.(c|sa|sc)ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader'
            ]
        }
    ],
},
});