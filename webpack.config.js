const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const SRC_DIR = path.resolve(__dirname, "");
const DIST_DIR = path.resolve(__dirname, "static/dist");
const port = process.env.PORT || 8081;

module.exports = {
    entry: {
        app: SRC_DIR + '/main.js'
    },

    output: {
        path: DIST_DIR,
        filename: 'index.js'
    },

    devServer: {
        port: port,
        index: './index.html',
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
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(html)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: 'static'
//                            path: DIST_DIR,
//                            filename: 'style.css',
                        }
                    },
                    "css-loader"
                ]
            }

        ]
    },
    plugins: [
//        new ExtractTextPlugin("./dist/[name].css"),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "/css/[name].css",
            chunkFilename: "/css/[id].css"
        })
    ]
//    optimization: {
//        splitChunks: {
//            chunks: 'all'
//        }
//    }
}
