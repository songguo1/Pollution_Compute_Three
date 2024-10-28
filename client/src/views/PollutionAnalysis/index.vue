<template>
  <div class="analysis">
    <div class="page-header">
      <el-row>
        <el-col :span="8">
          <div>
            <el-page-header @back="goBack" content="污染分析"> </el-page-header>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="button-header">
            <el-button
              size="medium"
              class="fa fa-file-excel-o"
              @click="showRecord"
              >分析记录</el-button
            >
            <el-button
              size="medium"
              class="fa fa-cloud-download"
              @click="downloadTemplate"
              >下载模板</el-button
            >
            <el-button
              size="medium"
              @click="drawer = true"
              class="fa fa-info-circle"
              >帮助
            </el-button>
          </div>
        </el-col>
      </el-row>
      <div>
        <el-drawer title="操作步骤" :visible.sync="drawer" :modal="false">
          <div class="dialogBox">
            <el-steps direction="vertical">
              <el-step
                title="步骤 1"
                status="process"
                description="点击“下载模板”按钮下载模板文件，填写模板，并保存为.xlsx格式。"
              ></el-step>
              <el-step
                title="步骤 2"
                status="process"
                description="选择时间，点击“数据导入”按钮，选择已填写好的EXCEL文件，将文件导入。"
              ></el-step>
              <el-step
                title="步骤 3"
                status="process"
                description="选择某一块数据，点击“污染分析”按钮，在弹出的弹框中选择某一个污染标准，背景为绿色的为正常值，背景为红色的为超标值。"
              ></el-step>
              <el-step
                title="步骤 4"
                status="process"
                description="点击“结果查询”按钮，查看污染分析结果。"
              ></el-step>
            </el-steps>
          </div>
        </el-drawer>
      </div>
      <el-dialog
      title="历史记录"
      :visible.sync="DialogShow"
      customClass="customWidth"
      
    >
      <Record ref="dialog"></Record>
    </el-dialog>
    </div>


    <div>
      <Table></Table>
    </div>
  </div>
</template>

<script>

import Table from "@/components/Analysis/Table.vue";
import Record from "@/components/Analysis/Record.vue";
export default {
  name: "Analysis",
  data() {
    return {
      drawer: false,
      DialogShow: false,
    };
  },
  components: { Table, Record },
  methods: {
    showRecord() {
      this.DialogShow = true;
      this.$refs.dialog.GetRecord()
    },
    goBack() {
      this.$router.go(-1);
    },
    downloadTemplate() {
      this.$axios
        .get("/file/download/template", { responseType: "blob" })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "template.xlsx"); // 文件名
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style land="less">
.page-header {
  padding: 20px;
  height: 60px;

  background-color: aliceblue;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  .el-drawer.ltr,
  .el-drawer.rtl {
    top: 60px;
    bottom: 0;
    width: 20% !important;
  }
}
.button-header {
  position: relative;
  width: 400px;
  top: -10px;
  float: right;
}
.dialogBox {
  height: 500px;
}
.dialogBox {
  padding: 10px;
}
.customWidth .el-dialog__header {
  border-bottom: 1px solid #e0e0e0; /* 添加下框线 */
}
.analysis {
  .el-dialog__body{
    padding:10px 20px!important;
  }
}

</style>
