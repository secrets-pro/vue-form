/*
 * @Author: bowen.xu
 * @Date: 2021-05-07 09:54:44
 * @Last Modified by: bowen.xu
 * @Last Modified time: 2021-05-18 16:24:20
 */

import vForm from "./components/Form.vue";
import config from "./config";
// import Edit from "./components/edit";
// import Vue from "vue";
vForm.install = function(Vue, option = { elementUI: true }) {
  Vue.component(vForm.name, vForm);
  // Vue.component("my-editor", Edit);
  // Vue.use(Edit);
  Object.assign(config.options, option);
};
export default vForm;
