const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base.config.js');

module.exports = merge(baseConfig, {
  devtool: 'cheap-module-eval-source-map',

  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    hot: true,
    publicPath: '/',
    historyApiFallback: true,
    port: 3000
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist'),
    // necessary for HMR to know where to load the hot update chunks
    publicPath: '/'
  },

  entry: [
    // activate HMR for React
    'react-hot-loader/patch',

    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:3000',

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',

    // the entry point of our app
    __dirname + '/src/index.tsx',
  ],

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { // creates style nodes from JS strings
            loader: "style-loader"
          },
          { // translates CSS into CommonJS (css-loader) and automatically generates TypeScript types
            loader: 'typings-for-css-modules-loader',
            options: {
              camelCase: true,
              modules: true,
              namedExport: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              importLoaders: 2,
              sourceMap: true
            }
          },
          { // compiles Sass to CSS
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          },
          { // Load global scss files in every other scss file without an @import needed
            loader: 'sass-resources-loader',
            options: {
              resources: ['./src/assets/styles/global-variables.scss']
            },
          },
        ]
      }
    ],
  },

  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),

    // Prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'arcjs_network': JSON.stringify(process.env.arcjs_network || 'ganache'),
        'NODE_ENV': JSON.stringify('development'),
        'S3_BUCKET': JSON.stringify(process.env.S3_BUCKET || "daostack-alchemy-staging"),
        'API_URL': JSON.stringify(process.env.API_URL || "http://127.0.0.1:3001"),
        'BASE_URL': JSON.stringify(process.env.BASE_URL || "http://localhost:3000")
      }
    })
  ]
});
