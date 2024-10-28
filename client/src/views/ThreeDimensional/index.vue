<template>
  <div>
    <div class="analysis">
      <div class="page-header">
        <div>
          <el-page-header @back="goBack" content="三维剖分"> </el-page-header>
        </div>
      </div>
      <div class="table_header">
        <div class="description">
          <el-descriptions class="margin-top" >
            <el-descriptions-item label="项目编号">{{
              this.$route.params.code
            }}</el-descriptions-item>
            <el-descriptions-item label="项目名称">{{
              this.$route.params.name
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div style="width: 100%; height: 575px">
        <three-js-scene></three-js-scene>
      </div>
    </div>
  </div>
</template>

<script>
import ThreeJsScene from "@/components/ThreeJsScene/ThreeJsScene.vue";
export default {
  name: "three",
  data() {
    return {
      //默认第一步
    };
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.push({ name: "home" });   //返回首页
  },
  },

  components: { ThreeJsScene },
};
</script>

<style land="less">
.el-step.is-simple .el-step__icon-inner.is-status {
  font-size: 17px;
}
.fa-icon-custom {
  font-size: 17px; /* 或者您希望的任何大小 */
}
.el-step.is-simple .el-step__icon {
  background: 0 0;
  width: 24px;
  height: 24px;
  font-size: 12px;
}
.analysis {
  .table_header {
  height: 50px;
  margin-top: 5px;
  background-color: white;
  .description {
    position: relative;
    top: 15px;
margin-left: 15px;
  }

  .el-icon-d-arrow-right {
    padding: 10px;
  }
}
}
</style>
