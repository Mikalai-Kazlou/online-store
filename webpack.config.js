const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCss = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = {
    entry: path.resolve(__dirname, './src/index.ts'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.(s*)css$/i,
                use: [miniCss.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
            // {
            //     test: /\.html$/i,
            //     loader: "html-loader",
            //   },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'details.html',
            template: path.resolve(__dirname, './src/details.html'),
        }),
        new HtmlWebpackPlugin({
            filename: 'card.html',
            template: path.resolve(__dirname, './src/card.html'),
        }),
        new HtmlWebpackPlugin({
            filename: '404.html',
            template: path.resolve(__dirname, './src/404.html'),
        }),

        new CleanWebpackPlugin(),
        new miniCss({
            filename: 'style.css',
        }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    { from: './src/assets', to: 'assets' },
                    { from: './src/.htaccess', to: './' }]
            },
        ),
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prd';
    const envConfig = isProductionMode ? require('./webpack.prd.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};
