import vForm from "./components/Form.vue";
import config from "./config";
import Edit from "./components/edit";
// import Vue from "vue";
vForm.install = function(Vue, option = { elementUI: true }) {
  Vue.component(vForm.name, vForm);
  Vue.component("my-edit", Edit);
  // Vue.use(Edit);
  Object.assign(config.options, option);
};
export default vForm;
