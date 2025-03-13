const HtmlWebpackPlugin = require ('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './client/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'client', 'index.html')
            // template: "/src/index.html"
        }),
    ],

    devServer: {
        port: 8000,
        static: {
            directory: path.join(__dirname, 'build'),
        },
        open: true,
        hot: true,
        compress: true,
        // proxy: [
        //     {
        //         context: ['/'],
        //         target: 'http://localhost:3000',
        //         changeOrigin: true,
        //     },
        // ]
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
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
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