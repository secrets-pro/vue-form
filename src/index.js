import vForm from "./components/Form.vue";
import config from "./config"
// import Vue from "vue";
vForm.install = function(Vue,option) {
  Vue.component(vForm.name, vForm,option);
  config.options = option
};
export default vForm;
