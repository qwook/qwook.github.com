// webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),  // Minify JavaScript
      new CssMinimizerPlugin(),  // Minify CSS (if you're handling CSS)
    ],
  },
});
