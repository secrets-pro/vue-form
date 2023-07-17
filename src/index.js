/*
 * @Author: bowen.xu
 * @Date: 2021-05-07 09:54:44
 * @Last Modified by: bowen.xu
 * @Last Modified time: 2023-07-17 20:02:18
 */

import vForm from "./components/Form.vue";
import config from "./config";
// import Edit from "./components/edit";
// import Vue from "vue";
vForm.install = function(Vue, option = { elementUI: true }) {
  if (option.en) {
    config.setEnResource(option.en)
  }
  Vue.component(vForm.name, vForm);
  // Vue.component("my-editor", Edit);
  // Vue.use(Edit);
  Object.assign(config.options, option);
  if (option.secretKeys) {
    config.setSecretKeys(option.secretKeys);
  }
  
};
export default vForm;
