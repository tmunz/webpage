const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '..', './dist'),
  },
  watchOptions: {
    aggregateTimeout: 200,
    ignored: /node_modules/,
    poll: 1000,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '..', 'public'),
    },
    compress: true,
    port: 8888,
    hot: true,
    open: true,
    client: {
      overlay: false,
    },
    historyApiFallback: true,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
};
