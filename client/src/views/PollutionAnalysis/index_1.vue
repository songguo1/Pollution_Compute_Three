<template>
  <div>
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="数据导入"
        ><i class="fa fa-cloud-upload fa-icon-custom" slot="icon"></i>
      </el-step>
      <el-step title="选择数据区"
        ><i class="fa fa-mouse-pointer fa-icon-custom" slot="icon"></i
      ></el-step>
      <el-step title="污染分析"
        ><i class="fa fa-cogs fa-icon-custom" slot="icon"></i
      ></el-step>
      <el-step title="结果保存"
        ><i
          class="fa fa-floppy-o fa-icon-custom"
          aria-hidden="true"
          slot="icon"
        ></i
      ></el-step>
      <el-step title="结果查询"
        ><i class="fa fa-folder-open fa-icon-custom" slot="icon"></i
      ></el-step>
    </el-steps>
    <div class="el_title">
      <div class="cascader">

      </div>
      <el-button
        :disabled="active == 4"
        style="margin: 6px; float: right"
        @click="next"
        >下一步</el-button
      >
      <el-button
        :disabled="active == 0"
        style="margin: 6px; float: right"
        @click="pre"
        >上一步</el-button
      >
      
    </div>

    <div v-show="active == 0">
      <DataImport
      :DataForm="DataForm1"></DataImport>
    </div>
    <div v-show="active == 1">
      <DataRegion></DataRegion>
    </div>
    <div v-show="active == 2">
      <ProlluAna></ProlluAna>
    </div>
    <div v-show="active == 3">
      <ResultSave></ResultSave>
      
    </div>
    <div v-show="active == 4">
      <ResultRearch></ResultRearch>
    </div>
  </div>
</template>

<script>
import DataImport from "../../components/Analysis/DataImport_1"
import DataRegion from "../../components/Analysis/DataRegion"
import ProlluAna from "../../components/Analysis/ProlluAna"
import ResultRearch from "../../components/Analysis/ResultRearch"
import ResultSave from "../../components/Analysis/ResultSave"
export default {
  name: "index_1",
  data() {
    return {
      //默认第一步
      active: 0,
      DataForm1:{
        code:this.$route.params.code,
        user:this.$store.getters.user.name
      }
    };
  },
  methods: {
    // 步骤条下一步的方法
    next() {
      this.active++;

    },
    // 步骤条上一步的方法
    pre() {
      this.active--;
    },

  },

  components: {DataImport,DataRegion,ProlluAna,ResultRearch,ResultSave},
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
.el_title{
  background-color: aliceblue;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  .cascader{
    display: inline-table;
    margin:5px;
    height:40px
  }
}
</style>
