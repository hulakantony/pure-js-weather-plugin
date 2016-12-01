/*eslint-disable*/
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:9000',
            './src/index.js'
        ]
    },
    output: {
        filename: 'app.js',
        path: path.join(__dirname, 'public'),
        publicPath: '/public/'
    },
    plugins: [
        new ExtractTextPlugin('style.css', { allChunks: true }),
        new HappyPack({
            loaders: ['babel-loader'],
            threads: 4
        }),
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'happypack/loader',
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.css$/i,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
        }, {
            test: /.*\.(gif|png|jpe?g|svg)$/i,
            loaders: [
                'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack-loader?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
            ]
        }, {
            test: /\.scss/,
            loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&sourceMap'
        }, {
            test: /\.(woff2|woff|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader"
        }]
    },
    eslint: {
        failOnError: true,
        failOnWarning : true
    },
    postcss: [
        autoprefixer({ browsers: ['last 2 versions'] })
    ],
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
        extensions: ['', '.js', '.json']
    }
};
