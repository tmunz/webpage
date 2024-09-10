const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const package = require('../package.json');

module.exports = (env) => ({
  entry: {
    app: path.resolve(__dirname, '..', './src/index.tsx'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.styl'],
  },
  module: {
    rules: [{
      test: /\.((j|t)sx?)$/,
      loader: 'babel-loader',
    }, {
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    convertPathData: false,
                    minify: false,
                    cleanupIDs: false,
                  },
                },
              },
            ]
          }
        }
      }],
    }, {
      test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      type: 'asset/resource',
    }, {
      test: /\.glb$|\.hdr$|\.ldr$|\.cube$/,
      type: 'asset/resource',
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.webp$/i,
      type: 'asset/resource',
      use: [
        {
          loader: 'responsive-loader',
          options: {
            // Set options for all transforms
          },
        },
      ],
      type: 'javascript/auto',
    }, {
      test: /\.css$|\.styl$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                [
                  'autoprefixer',
                  {
                    // Options
                  },
                ],
              ],
            },
          },
        },
        'stylus-loader'
      ],
    }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, '..', './public/') }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './template/index.html'),
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "APP_VERSION": JSON.stringify(package.version),
        "MODE": JSON.stringify(env),
      }
    }),
  ],
});
