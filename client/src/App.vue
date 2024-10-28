<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";
export default {
  name: "app",

  //页面刷新后重新将token存储在vuex
  created() {
    if (localStorage.mytoken) {
      const decoded = jwtDecode(localStorage.mytoken);
      // token存储到vuex中
      this.$store.dispatch("setIsAutnenticated", !this.isEmpty(decoded));
      this.$store.dispatch("setUser", decoded);
    }
  },
  methods: {
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
  },
};
</script>

<style lang="less">
#app {
  height: 100vh;
}
html,
body {
  margin: 0;
  padding: 0;
}
</style>
