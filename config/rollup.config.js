import vueplugin from "rollup-plugin-vue";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
// import uglify from "rollup-plugin-uglify-es";

let baseconfig = (format) => {
  return {
    input: "./src/index.js",
    output: {
      name: "vue-form",
      globals: {
        vue: "Vue",
        lodash: "lodash"
      },
      extend: true,
      format,
      sourceMap: true,
      file:
        format === "iife" ? "dist/vue-form.js" : `dist/vue-form.${format}.js`
    },
    external: ["vue", "lodash"],
    plugins: [
      resolve(),
      babel({
        exclude: "node_modules/**" // 只编译我们的源代码
      }),
      vueplugin({ css: true })
      // uglify()
    ]
  };
};
// baseconfig("esm"), , baseconfig("iife") , baseconfig("cjs")
export default [baseconfig("esm")];
