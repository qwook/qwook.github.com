// webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const TitleInjectorPlugin = require("./TitleInjectorPlugin");
const webpack = require("webpack");

// const PrerendererWebpackPlugin = require("./webpack-plugin");

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
      let name = relativePath.replace(/\.jsx$/, "").replace(/\\/g, "/"); // Convert backslashes to forward slashes for consistency
      if (item.name === "index.jsx") {
        name = name.replace(/index$/, "");
      }
      entries[name] = itemPath;
    }
  });

  return entries;
}

const production = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(), // Minify JavaScript
      new CssMinimizerPlugin(), // Minify CSS (if you're handling CSS)
    ],
  },
  // plugins: [
  //   new PrerendererWebpackPlugin({
  //     // (REQUIRED) List of routes to prerender
  //     routes: ["/", "/events/game1"],

  //     rendererOptions: {
  //       // headless: false,
  //       renderAfterDocumentEvent: "render-event",
  //       inject: {},
  //       timeout: 10000,
  //       headless: false,
  //     },
  //   }),
  // ],
});

module.exports = [
  merge(production, {
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "node"),
    },
    target: "node",
  }),
  merge(production, {
    plugins: [new TitleInjectorPlugin()],
  }),
];
