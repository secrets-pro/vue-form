import vForm from "./components/Form.vue";
// import Vue from "vue";
vForm.install = function(Vue) {
  Vue.component(vForm.name, vForm);
};
export default vForm;
