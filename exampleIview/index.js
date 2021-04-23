import "view-design/dist/styles/iview.css";

import Vue from "vue";
import App from "./App.vue";
import elementUI from "view-design";
import VueForm from "../src";

Vue.use(elementUI);
Vue.use(VueForm,{element:false});
new Vue({
  render: (h) => h(App)
}).$mount("#app");
