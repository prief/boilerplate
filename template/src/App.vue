<template>
  <div id="app">
    <img src="./assets/imgs/app.png" >
    {{#router}}
    <router-view/>
    {{else}}
    <Hello/>
    {{/router}}
    <ul>
      <li class="ico ico-i1"></li>
      <li class="ico ico-i2"></li>
      <li class="ico ico-i3"></li>
      <li class="ico ico-i4"></li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import api from "../mock/api.js";
{{#unless router}}
import Hello from "./pages/Hello"
{{/unless}}
export default {
  name: "App",
  {{#router}}{{else}}
  components: {
    Hello
  }{{/router}}
  async created() {
    let res = await axios.get(api.getUserInfo);
    console.log(res);
  }
};

</script>
<style  lang="scss" scoped>
@import "~sprite2.scss";

$black: black;
$yellow: #ff0;

h2 {
  font-size: 40px;
  color: $black;
  background: $yellow;
  transform: rotate(20deg);
}
</style>