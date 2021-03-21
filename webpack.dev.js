const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  devtool: false,
  devServer: {
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/, // Regex
        use: [
          'style-loader', //3. Injects styles into the DOM
          'css-loader', //2. Turns css into commonjs
          'sass-loader', //1. Turns sass into css
        ],
      },
    ],
  },
});
