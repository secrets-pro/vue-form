import "element-ui/lib/theme-chalk/index.css";

import Vue from "vue";
import App from "./App.vue";
import elementUI from "element-ui";
import VueForm from "../src";

Vue.use(elementUI);
Vue.use(VueForm,{elementUI:true});
new Vue({
  render: (h) => h(App)
}).$mount("#app");
