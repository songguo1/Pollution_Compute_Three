<template>
  <div class="Table">
    <el-dialog
      title="数据导入"
      :visible.sync="isShow"
      customClass="customWidth"
    >
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
    </el-dialog>
    <ProlluAna ref="ProlluAna" @submit_data="standardData"></ProlluAna>

    <div class="table_header">
      <div class="description">
        <el-descriptions class="margin-top">
          <el-descriptions-item label="项目编号">{{
            this.$route.params.code
          }}</el-descriptions-item>
          <el-descriptions-item label="项目名称">{{
            this.$route.params.name
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="block">
        <span>分析日期：</span>
        <el-date-picker
          v-model="datevalue"
          type="datetime"
          placeholder="选择日期时间"
          @change="changeDate(datevalue)"
        >
        </el-date-picker>
      </div>

      <transition name="slide-fade">
        <div v-show="showTable" class="button_header">
          <el-button
            class="fa fa-cloud-upload fa-icon-custom"
            size="small"
            type="primary"
            @click="DataImport"
          >
            数据导入</el-button
          >
          <span><i class="el-icon-d-arrow-right"></i></span>
          <el-button
            class="fa fa-cogs fa-icon-custom"
            size="small"
            type="primary"
            @click="showProlluAna"
          >
            污染分析</el-button
          >
          <i class="el-icon-d-arrow-right"></i>
          <el-button
            class="fa fa-folder-open fa-icon-custom"
            size="small"
            type="primary"
            @click="toggleTable"
          >
            结果查询</el-button
          >
        </div>
      </transition>
      <transition name="slide-fade">
        <div v-if="!showTable" class="button_header">
          <el-button
            class="fa fa-undo"
            size="small"
            type="primary"
            @click="toggleTable"
          >
            返回</el-button
          >
        </div>
      </transition>
    </div>

    <transition name="slide-fade">
      <div v-show="showTable" class="excel-main" ref="hotTable"></div>
    </transition>
    <transition name="slide-fade">
      <div v-if="!showTable" class="result-component">
        <ResultRearch :Options="chartConfigs"></ResultRearch>
      </div>
    </transition>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import ProlluAna from "./ProlluAna";
import * as XLSX from "xlsx";
import "handsontable/dist/handsontable.full.css";
import Handsontable from "handsontable";
import ResultRearch from "./ResultRearch.vue";
import { hotSettings } from "./js/hotSettings";
import { createChartConfig } from "./js/EchartsOptions";
export default {
  data() {
    return {
      //echarts配置
      chartConfigs: {},
      showTable: true,
      // 标记变量，用于记录是否已经显示过警告
      warningAlreadyShown: false,
      isShow: false,
      hotInstance: null,
      //选中的行列
      Select: {
        row1: null,
        col1: null,
        row2: null,
        col2: null,
      },
      headerObj: {
        Authorization: localStorage.getItem("mytoken"),
      },
      DataForm: {
        code: this.$route.params.code,
        user: this.$store.getters.user.name,
        date: "",
      },
      excelData: null,
      datevalue: "",
    };
  },
  name: "Table",
  components: { ProlluAna, ResultRearch },
  mounted() {
    this.$nextTick(() => {
      this.renderTable();
    });
  },
  methods: {
    //日期选择
    changeDate(date) {
      const formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
      this.DataForm.date = formattedDate;
      console.log(this.DataForm);
    },

    //触发结果查询按钮
    toggleTable: _.debounce(function () {
      this.showTable = !this.showTable;
    }, 300),
    //赋值
    assign_selection(row1, col1, row2, col2) {
      this.Select.row1 = row1;
      this.Select.col1 = col1;
      this.Select.row2 = row2;
      this.Select.col2 = col2;
    },

    //获取从子组件ProAna获取的污染标准数据
    standardData(data) {
      //进行污染分析
      this.analyzePollution.bind(this)(
        this.Select.row1,
        this.Select.col1,
        this.Select.row2,
        this.Select.col2,
        data[1]
      );
    },
    showProlluAna() {
      // 检查选中的行是否在6到14行之间
      if (
        this.Select.row1 >= 5 &&
        this.Select.row2 <= 13 &&
        this.Select.col1 >= 4
      ) {
        this.$refs.ProlluAna.showDialog();
      } else {
        return this.$message({
          message: "请选择正确的数据区",
          type: "warning",
        });
      }
    },
    DataImport() {
      this.isShow = true;
    },
    handleFileSuccess(res, file) {
      console.log(res);
      this.$axios
        .get(`/file/download/oss/${res.message}`, {
          responseType: "arraybuffer", // 注意这里使用 arraybuffer
        })
        .then((response) => {
          const data = new Uint8Array(response.data);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          this.$message.success("成功上传文件");
          this.isShow = false;
          this.renderTable();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    renderTable() {
      if (this.hotInstance) {
        this.hotInstance.destroy();
      }

      const container = this.$refs.hotTable;
      hotSettings.data = this.excelData;
      hotSettings.afterSelection = (row1, col1, row2, col2) => {
        this.assign_selection(row1, col1, row2, col2);
      };
      this.hotInstance = new Handsontable(container, hotSettings);
    },

    analyzePollution(startRow, startCol, endRow, endCol, data) {
      //创建一个对象存储所有污染物数据
      let crossData = {};

      // 获取对象的属性名，即污染物种类
      const pollutants = ["PH", "As", "Cd", "Cu", "Pb", "Hg", "Ni", "Cr"];
      pollutants.forEach((pollutant) => {
        crossData[pollutant] = [];
      });
      const hot = this.hotInstance;

      // 初始化xAxisData，确保它包含所有行的样本名称
      const xAxisData = [];
      for (let col = startCol; col <= endCol; col++) {
        xAxisData.push(hot.getDataAtCell(0, col));
      }

      // 遍历选中的区域内的每一行
      for (let row = startRow; row <= endRow; row++) {
        // 获取当前行的阈值
        const threshold = data[pollutants[row - 5]];

        // 遍历当前行的所有单元格
        for (let col = startCol; col <= endCol; col++) {
          const cellData = hot.getDataAtCell(row, col);
          crossData[pollutants[row - 5]].push(cellData);

          // 检查单元格数据是否为数字并且大于当前行的阈值
          if (typeof cellData === "number" && cellData > threshold) {
            // 设置单元格背景色为红色
            hot.setCellMeta(row, col, "className", "red-background");
          } else {
            // 清除单元格背景色
            hot.setCellMeta(row, col, "className", "green-background");
          }
        }

        // 创建yAxisData，确保它包含所有行的数据
        let yAxisData = [];
        for (let col = startCol; col <= endCol; col++) {
          const cellData = hot.getDataAtCell(row, col);
          if (typeof cellData === "number" && cellData > threshold) {
            yAxisData.push({
              value: cellData,
              itemStyle: { color: "#a90000" },
            });
          } else {
            yAxisData.push(cellData);
          }
        }
        // 创建chart配置对象，并将其存储在chartConfigs数组中
        this.chartConfigs[pollutants[row - 5]] = createChartConfig(
          xAxisData,
          yAxisData
        );
      }

      //存入vuex
      this.$store.commit("setChartConfig", crossData);
      console.log(this.$store.getters.getChartConfig);

      // 重新渲染表格以显示更新的背景色
      hot.render();
    },

    // 表单验证

    beforeFileUpload(file) {
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
.customWidth {
  width: 30% !important;
}
.Table {
  .el-dialog__headerbtn .el-dialog__close {
    color: azure;
  }
  .el-dialog__title {
    color: azure;
  }
  .el-dialog__header {
    background-color: rgb(89, 148, 199);
  }
  .el-dialog {
    top: 50px;
  }
  .table_header {
    height: 50px;
    margin-top: 5px;
    background-color: white;
    display: flex;
    justify-content: space-between;

    .description {
      position: relative;
      top: 15px;
      left: 5px;
      width: 500px;
    }
    .button_header {
      float: right;
      margin-right: 5px;
      margin-top: 5px;
      /* 置于最右边 */
    }
    .block {
      width: 500px;
      margin-top: 5px;
      margin-right: 5px;
    }
    .el-icon-d-arrow-right {
      padding: 10px;
    }
  }
}

.excel_main {
  width: 100%;
}
.handsontable {
  margin-top: 10px;
}
.red-background {
  background-color: rgb(204, 90, 90) !important;
}
.green-background {
  background-color: greenyellow !important;
}
.slide-fade-enter-active {
  transition: all 0.8s ease; /* 出现时缓慢出现 */
}
.slide-fade-leave-active {
  transition: all 0.3s ease; /* 消失时快速消失 */
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
