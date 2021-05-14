const { merge } = require("webpack-merge");
const base = require("./webpack");
module.exports = merge(base, {
  mode: "production"
});
