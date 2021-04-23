import vForm from "./components/Form.vue";
import config from "./config"
// import Vue from "vue";
vForm.install = function(Vue,option={elementUI:false}) {
  Vue.component(vForm.name, vForm,option);
  config.options = option
  console.log(option,"option");
};
export default vForm;
