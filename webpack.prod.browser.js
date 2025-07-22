const { merge } = require("webpack-merge");
const TitleInjectorPlugin = require("./TitleInjectorPlugin");
const production = require("./webpack.prod");

module.exports = [
  merge(production, {
    plugins: [new TitleInjectorPlugin()],
  }),
];
