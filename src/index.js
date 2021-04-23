import vForm from "./components/Form.vue";
import config from "./config";
// import Vue from "vue";
vForm.install = function(Vue, option = { elementUI: true }) {
  Vue.component(vForm.name, vForm);
  Object.assign(config.options, option);
};
export default vForm;
