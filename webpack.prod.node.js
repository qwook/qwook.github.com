const { merge } = require("webpack-merge");
const production = require("./webpack.prod");
const path = require("path");

module.exports = [
  merge(production, {
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "node"),
    },
    target: "node",
  }),
];
