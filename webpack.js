var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var customProperties = require('postcss-custom-properties');
var cssImport = require('postcss-import');
var nested = require('postcss-nested');
var cssShort = require('postcss-short');
var assets = require('postcss-assets');
var localScope = require('postcss-local-scope');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'index.js')
    },
    output: {
        path: 'dist',
        libraryTarget: 'var',
        filename: 'makeup.js'
    },
    externals: {
        $: 'jquery'
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
                )
            }
        ],
        noParse: [
            path.resolve(__dirname, 'node_modules/handlebars/dist/handlebars.min.js')
        ]
    },

    postcss: function() {
        return [
            assets(),
            nested,
            cssShort(),
            cssImport(),
            customProperties(),
            localScope(),
            autoprefixer(),
            cssnano()
        ];
    },

    resolve: {
        extension: ['', '.js'],
        alias: {
            handlebars: path.resolve(__dirname, 'node_modules/handlebars/dist/handlebars.min.js')
        }
    },

    plugins: [
        new ExtractTextPlugin('makeup.css', {
            allChunks: true
        })
    ],

    node: {
        fs: 'empty'
    },

    target: 'web',
    devtool: 'source-map'
};