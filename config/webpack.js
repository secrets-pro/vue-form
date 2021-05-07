const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const webpack = require("webpack");
function resolve(_path) {
  return path.resolve(__dirname, _path);
}
module.exports = {
  entry: `./${process.env.entry}/index.js`,
  output: {
    filename: "index.js",
    chunkFilename: "[name].[hash:8].bundle.js",
    path: resolve(`../docs/${process.env.output}`)
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader"
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/transform-runtime"]
            }
          }
        ]
      },

      {
        test: /\.(css|less)$/,
        use: ["vue-style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.(ttf|svg|eot|woff|woff2)$/,
        use: ["url-loader"]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"development"'
    }),
    new htmlWebpackPlugin({
      title: "hello",
      inject: true,
      template: "public/index.html"
    }),
    new VueLoaderPlugin(),
    new MonacoWebpackPlugin({
      languages: ["javascript", "css", "html", "typescript", "json"]
    })
  ],
  resolve: {
    alias: {
      "@": resolve("../src")
    }
  }
};
