import Vue from "vue";
import App from "./App.vue";
import router from "../src/router";
import VConsole from "vconsole";
new VConsole();

let p = new Promise(function(resolve) {
    setTimeout(() => {
      resolve("done");
    }, 1000);
  });
  p.then(res => {
    console.log(res);
  });

new Vue({
  el: "#app",
  render: h => h(App),
  router,
});