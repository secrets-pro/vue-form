module.exports = {
  presets: [["@babel/preset-env", { modules: false }]],
  plugins: ["@vue/babel-plugin-transform-vue-jsx"],
  env: {
    test: {
      presets: [["@babel/preset-env"]],
      plugins: ["@vue/babel-plugin-transform-vue-jsx"],
    },
  },
};
