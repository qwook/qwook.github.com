// webpack.common.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");
const { ProvidePlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function getEntryPoints(dir = "src/pages", entries = {}) {
  const fullPath = path.resolve(__dirname, dir);

  // Read the contents of the directory
  fs.readdirSync(fullPath, { withFileTypes: true }).forEach((item) => {
    const itemPath = path.join(fullPath, item.name);

    if (item.isDirectory()) {
      // If the item is a directory, recursively process it
      getEntryPoints(path.join(dir, item.name), entries);
    } else if (item.isFile() && item.name.endsWith(".jsx")) {
      // If the item is a .jsx file, add it to the entries
      // Generate a path relative to 'src/pages' and remove the file extension
      const relativePath = path.relative("src/pages", itemPath);
      const name = relativePath.replace(/\.jsx$/, "").replace(/\\/g, "/"); // Convert backslashes to forward slashes for consistency
      entries[name] = itemPath;
    }
  });

  return entries;
}

module.exports = {
  entry: {
    index: "./src/index.jsx",
    ...getEntryPoints(),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "site"),
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: "all",
  //   },
  // },
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
      {
        test: /\.css$/,
        use: [
          "style-loader", // Injects CSS into the DOM
          "css-loader", // Resolves CSS imports and URLs
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader", // Compiles SCSS to CSS
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Images
        type: "asset/resource", // For Webpack 5+
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
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};