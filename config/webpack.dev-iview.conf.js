const { merge } = require("webpack-merge");
const path = require("path");
const base = require("./webpack");
module.exports = merge(base, {
  entry: "./exampleIview/index.js",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "docs"),
    compress: true,
    port: 8081,
    hot: true,
    open: true //默认打开浏览器
  }
});
