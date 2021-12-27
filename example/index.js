import "element-ui/lib/theme-chalk/index.css";

import Vue from "vue";
import App from "./App.vue";
import VueForm from "../src";

import elementUI from "element-ui";
Vue.use(elementUI);
Vue.use(VueForm,{ elementUI: true });

// import ViewUI from 'view-design';
// import 'view-design/dist/styles/iview.css';
// import "./iview.js";
// Vue.use(ViewUI);
// Vue.use(VueForm,{ iView: true });

new Vue({
  render: (h) => h(App)
}).$mount("#app");
