<template>
  <div class="shell">
    <a href="/projectlist" class="box"
      ><i class="icon fa fa-table"></i><span>项目列表</span></a
    >
    <div @click="skipToAnalysis" class="box">
      <i class="icon fa fa-file-text"></i><span>污染分析</span>
    </div>
    <div @click="skipToThree" class="box"
      ><i class="icon fa fa-cube"></i><span>三维剖面</span></div
    >
  </div>
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object,
      default: {},
    },
  },
  methods: {
    skipToThree() {


      if(this.$store.getters.getChartConfig==null || Object.keys(this.$store.getters.getChartConfig).length === 0){
        this.$message.error("请先进行分析");
        return;
      }
      if (Object.keys(this.selectedItem).length === 0) {
        this.$message.error("请先选择项目");
        return;
      }
      this.$router.push(`/pollutionthree/${this.selectedItem.code}/${this.selectedItem.name}`);
    },
    skipToAnalysis() {
      if (Object.keys(this.selectedItem).length === 0) {
        this.$message.error("请先选择项目");
        return;
      }
      this.$router.push(`/pollutionanalysis/${this.selectedItem.code}/${this.selectedItem.name}`);
    },
  },
  name: "LeftMenu",
  components: {},
};
</script>

<style>
@import url("../../assets/scss/style.css");
</style>
