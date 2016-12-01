/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    devtool: 'cheap-source-map',
    entry: {
        'js/app': ['babel-polyfill', './src/index.js'], 
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.js'),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 6
        }),
        new ExtractTextPlugin('styles/all.css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.template.html'
        }),
    ],
    module: {       
        loaders: [{
            test: /\.js$/,
            loader: 'babel?cacheDirectory=/usr/src/app/babel',
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.css$/i,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }, {            
            test: /\.scss/,
            loader: ExtractTextPlugin.extract(
                "style-loader", 
                "css-loader?modules&importLoaders=2&sourceMap!sass-loader?outputStyle=expanded&sourceMap"
            )
        }, {
            test: /\.html/,
            loader: 'html-loader'
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file?hash=sha512&digest=hex&name=./images/[hash].[ext]',
                'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
            ]
        }, {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file?name=./fonts/[name].[ext]'
        }]
    },
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
        extensions: ['', '.js', '.json'],
    },
    postcss: [ 
        autoprefixer({ browsers: ['last 2 versions'] }) 
    ]
};
