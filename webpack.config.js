const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCss = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');

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
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/[folder]/[name].[ext]',
                },
            },
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
            template: path.resolve(__dirname, './src/pages/product-details/details.html'),
        }),
        new HtmlWebpackPlugin({
            filename: 'cart.html',
            template: path.resolve(__dirname, './src/pages/cart/cart.html'),
        }),
        new HtmlWebpackPlugin({
            filename: '404.html',
            template: path.resolve(__dirname, './src/pages/404/404.html'),
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
        new EslingPlugin({ extensions: 'ts' }),
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prd';
    const envConfig = isProductionMode ? require('./webpack.prd.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};
