// webpack.common.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");
const { ProvidePlugin } = require("webpack");

function getEntryPoints() {
  const entries = {};
  const blogsDir = path.resolve(__dirname, "src/blogs");

  fs.readdirSync(blogsDir).forEach((file) => {
    if (file.endsWith(".jsx")) {
      const name = file.replace(".jsx", "");
      entries[name] = path.resolve(blogsDir, file);
    }
  });

  return entries;
}

module.exports = {
  entry: {
    index: { import: "./src/index.jsx" },
    ...getEntryPoints(),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "site"),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
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
          },
        },
      },
    ],
  },
  plugins: [
    new ProvidePlugin({
      React: "react",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      chunks: ["index"],
    }),
    ...Object.keys(getEntryPoints()).map(
      (name) =>
        new HtmlWebpackPlugin({
          filename: `${name}/index.html`,
          template: path.resolve(__dirname, "src/index.html"),
          chunks: [name],
        })
    ),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
