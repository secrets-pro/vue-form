// import Vue from "vue";
// import ElementUI from "element-ui";
// Vue.use(ElementUI);
import vForm from "./components/Form";

vForm.install = function(Vue) {
  Vue.component(vForm.name, vForm);
};
export default vForm;
