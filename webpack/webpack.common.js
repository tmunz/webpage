const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const package = require('../package.json');

module.exports = (env) => ({
  cache: {
    type: 'filesystem',
    name: `webpack-${env}`,
    buildDependencies: {
      config: [
        __filename,
        path.resolve(__dirname, './webpack.config.js'),
        path.resolve(__dirname, env === 'production' ? './webpack.prod.js' : './webpack.dev.js'),
        path.resolve(__dirname, '..', './.babelrc'),
      ],
    },
  },
  entry: {
    app: path.resolve(__dirname, '..', './src/index.tsx'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.css'],
  },
  module: {
    rules: [{
      test: /\.((j|t)sx?)$/,
      include: path.resolve(__dirname, '..', './src'),
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          plugins: env === 'development' ? [require.resolve('react-refresh/babel')] : [],
        },
      },
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
      test: /\.(ttf|eot|otf|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      type: 'asset/resource',
    }, {
      test: /\.glb$|\.hdr$|\.ldr$|\.cube$|\.mp4$/,
      type: 'asset/resource',
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.webp$/i,
      type: 'asset/resource',
      use: [
        {
          loader: 'responsive-loader',
          options: {
            disable: env === 'development',
            cacheDirectory: env === 'production'
              ? path.resolve(__dirname, '..', './node_modules/.cache/responsive-loader')
              : false,
            cacheCompression: false,
          },
        },
      ],
      type: 'javascript/auto',
    }, {
      test: /\.css$/,
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
        }
      ],
    }
    ]
  },
  plugins: [
    ...(env === 'production' ? [new CleanWebpackPlugin()] : []),
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
