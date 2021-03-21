const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  output: {
    assetModuleFilename: 'assets/[name][hash][ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
      favicon: '',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
      {
        test: /\.(svg|png|jpg|gif|webp|mp4)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};
