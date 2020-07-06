const MonacoEditorPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  configureWebpack: {
    externals: {
      "element-ui": "element-ui",
      Vue: "vue",
      "core-js": "core-js"
    },
    plugins: [
      new MonacoEditorPlugin({
        languages: ["javascript", "css", "html", "typescript", "json"]
      })
    ]
  }
};
