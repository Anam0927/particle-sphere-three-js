const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'main-[contenthash].js',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles/[name]-[contenthash].css' }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/, // Regex
        use: [
          MiniCssExtractPlugin.loader, //3. Extracts CSS into separate files
          'css-loader', //2. Turns css into commonjs
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          }, // For using autoprefixer
          'sass-loader', //1. Turns sass into css
        ],
      },
    ],
  },
});
