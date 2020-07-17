const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
function resolve(_path) {
  return path.resolve(__dirname, _path);
}
module.exports = {
  entry: './example/index.js',
  output: {
    filename: 'index.js',
    chunkFilename: '[name].[hash:8].bundle.js',
    path: resolve('../example/dist')
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.(css|less)$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(ttf|svg|eot|woff|woff2)$/,
        use: ['url-loader']
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new htmlWebpackPlugin({
      title: 'hello',
      inject: true,
      template: 'public/index.html'
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve('../src')
    }
  },
  devServer: {
    contentBase: path.join(__dirname, 'example/dist'),
    compress: true,
    port: 8080,
    hot: true,
    open: true //默认打开浏览器
  }
};
