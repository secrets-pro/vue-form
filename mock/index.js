import Vue from "vue";
import request from "./request";
// 加载mock数据
import mock from "./data";

Vue.prototype.$http = request;
