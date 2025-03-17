const HtmlWebpackPlugin = require ('html-webpack-plugin');
const path = require('path');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const { loader } = require('@monaco-editor/react');

module.exports = {
    mode: 'development',
    entry: './client/src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'public', 'index.html')
            // template: "/src/index.html"
        }),
        //[new MonacoWebpackPlugin()],
    ],

    devServer: {
        port: 8000,
        static: {
            directory: path.join(__dirname, 'build'),
        },
        open: true,
        hot: true,
        compress: true,
        proxy: [
            {
                context: ['/'],
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        ]
    },


    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        targets: 'defaults',
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    }
                }
            },
            {
                test: /\.css$/i, 
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe&g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            }
            
        ]
    }
}