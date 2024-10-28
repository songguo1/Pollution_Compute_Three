<template>
  <div class="DataImport">
    <el-upload
      class="upload-demo"
      drag
      action="http://127.0.0.1:3000/api/file/upload"
      multiple
      :data="DataForm"
      :before-upload="beforeFileUpload"
      :on-success="handleFileSuccess"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__text">只能上传excel文件</div>
    </el-upload>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
export default {
  props: {
    Show: Boolean,
  },
  data() {
    return {
      //图片上传组件的headers请求头对象
      headerObj: {
        Authorization: localStorage.getItem("mytoken"),
      },
      DataForm: {},
      excelData:{},
      showLocal: this.show, // 创建一个响应式数据属性来存储 show 的值
    };
  },
  mounted() {},
  methods: {
   handleFileSuccess(file) {
      this.$axios
        .get(`/file/download/oss/${file.name}`, {
          responseType: "arraybuffer", // 注意这里使用 arraybuffer
        })
        .then((response) => {
          const data = new Uint8Array(response.data);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          this.excelData = XLSX.utils.sheet_to_json(worksheet);
          this.$message.success("成功上传文件");
          this.showLocal = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // 表单验证

    beforeFileUpload(file) {
      this.DataForm = {
        code: this.$route.params.code,
        user: this.$store.getters.user.name,
      };
      const isxlsx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (!isxlsx) {
        this.$message.error("上传文件只能是 xlsx 格式!");
      }

      return isxlsx;
    }, 
  },
};
</script>

<style land="less">
.DataImport {
  margin-top: 20px;
}

.el-upload-dragger .el-upload__text {
  height: 20px;
}
.el-dialog__header {
  background-color: rgb(89, 148, 199);
}
.el-dialog__headerbtn .el-dialog__close {
  color: azure;
}
.el-dialog__title {
  color: azure;
}
</style>
