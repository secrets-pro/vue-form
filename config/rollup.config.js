import vueplugin from "rollup-plugin-vue";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

let baseconfig = format => {
	return {
		input: "./src/index.js",
		output: {
			name: "vue-form",
			globals: {
				vue: "Vue"
				// lodash: "_"
			},
			extend: true,
			format,
			sourcemap: false,
			file:
				format === "iife" ? "dist/vue-form.js" : `dist/vue-form.${format}.js`
		},
		external: ["vue"],
		plugins: [
			resolve(),
			babel({
				exclude: "node_modules/**" // 只编译我们的源代码
			}),
			vueplugin({ css: true }), //
			// terser()
		]
	};
};
// , baseconfig("iife"), baseconfig("cjs")
export default [baseconfig("esm")];
