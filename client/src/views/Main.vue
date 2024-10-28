<template>
  <div class="main">
    <HeadNav></HeadNav>

    <div class="rightContainer" >
      <keep-alive exclude="three,Analysis">
      <router-view></router-view>
    </keep-alive>
    </div>
    
  </div>
</template>

<script>
import HeadNav from "../components/HeadNav";

export default {
  name: "Main",
  components: {
    HeadNav,

  },
};
</script>

<style>
.main {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使用视口高度 */
}
.rightContainer {
  flex-grow: 1; /* 占据剩余空间 */
  overflow: auto; /* 添加滚动条，如果内容超出容器高度 */
}

</style>

