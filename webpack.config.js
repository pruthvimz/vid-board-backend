const path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, "");
const DIST_DIR = path.resolve(__dirname, "");
const port = process.env.PORT || 8081;

module.exports = {
    entry: {
        app: SRC_DIR + '/main.js'
    },

    output: {
        path: DIST_DIR,
        filename: 'index.js',
//      publicPath: '/'
    },

    devServer: {
        inline: true,
        port: port,
        historyApiFallback: true
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015', 'stage-2'],
                    },
                },
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react', 'es2015', 'stage-2'],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            }
        ]
    },

//    optimization: {
//        splitChunks: {
//            chunks: 'all'
//        }
//    }
}
