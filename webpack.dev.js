// webpack.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    hot: true,
    liveReload: false,
    // open: true,
    // historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["react-refresh/babel"],
          },
        },
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin(), new HotModuleReplacementPlugin()],
});
