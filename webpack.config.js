var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginIndex = new HTMLWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
});
module.exports = {
  mode: 'development',
  entry: {
    index: __dirname + '/app/index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'css-loader',
        query: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    ]
  },
  output: {
    filename: '[name].[contenthash:8].bundle.js',
    path: __dirname + '/build',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },
  plugins: [HTMLWebpackPluginIndex]
};