<template>
  <div class="analysis-result">
    <div class="chart-container">
      <h2>分析结果</h2>
      <span class="select-label">请选择检测项目：</span>
      <el-select
        class="chart-select"
        v-model="selectIndex"
        placeholder="请选择项目"
        @change="handleChange"
      >
        <el-option
          v-for="item in types"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div ref="main" style="width: 600px; height: 400px"></div>
    </div>

    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="type" label="检测指标" width="180">
        </el-table-column>
        <el-table-column prop="quatity" label="送检数量" width="180">
        </el-table-column>
        <el-table-column prop="max" label="最大值"> </el-table-column>
        <el-table-column prop="min" label="最小值"> </el-table-column>
        <el-table-column prop="avg" label="平均值"> </el-table-column>
        <el-table-column prop="exceed" label="超标点位数"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

export default {
  props: {
    Options: Object,
  },
  name: "charts",
  data() {
    return {
      selectIndex: "PH",
      listObj: ["PH", "As", "Cd", "Cu", "Pb", "Hg", "Ni", "Cr"],
      types: [],
      chartInstance: null,
      tableData: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts();
      this.analyzeChartDataAndPopulateTable(); // 调用分析数据的方法
    });
  },
  methods: {
    initCharts() {
      const keyMap = {
        PH: "PH值",
        As: "砷",
        Cd: "镉",
        Cu: "铜",
        Pb: "铅",
        Hg: "汞",
        Ni: "镍",
        Cr: "六价铬",
      };

      for (const key of this.listObj) {
        const translatedKey = keyMap[key];
        this.types.push({ value: key, label: translatedKey });
      }
      echarts.use([GridComponent, BarChart, CanvasRenderer]);
      this.chartInstance = echarts.init(this.$refs.main);
      this.updateChartOption("PH"); // 初始化时显示 "PH" 配置
    },
    handleChange() {
      this.updateChartOption(this.selectIndex); // 根据选择的项目更新柱状图配置
    },
    updateChartOption(selectedItem) {
      const option = this.Options[selectedItem]; // 根据选择的项目获取对应的配置信息
      console.log(option);
      this.chartInstance.setOption(option); // 更新柱状图的配置
    },
    analyzeChartDataAndPopulateTable() {
      // 调用分析函数并处理结果
      const analysisResult = this.analyzeChartData(this.Options);
      this.tableData = analysisResult.keysArray.map((key, index) => {
        return {
          type: key,
          quatity: analysisResult.valuesArray[index].length,
          max: analysisResult.maxArray[index],
          min: analysisResult.minArray[index],
          avg: analysisResult.avgArray[index].toFixed(2),
          exceed: analysisResult.styledCountArray[index],
        };
      });
    },
    analyzeChartData(option) {
      const keys = Object.keys(option);
      const valuesArray = [];
      const maxArray = [];
      const minArray = [];
      const avgArray = [];
      const styledCountArray = [];

      keys.forEach((key) => {
        const seriesData = option[key].series[0].data;
        const values = seriesData.map((item) =>
          typeof item === "number" ? item : item.value
        );
        valuesArray.push(values);

        const max = Math.max(...values);
        const min = Math.min(...values);
        const sum = values.reduce((acc, val) => acc + val, 0);
        const avg = sum / values.length;

        maxArray.push(max);
        minArray.push(min);
        avgArray.push(avg);

        const styledCount = seriesData.filter((item) => {
          return (
            typeof item !== "number" &&
            item.itemStyle &&
            item.itemStyle.color === "#a90000"
          );
        }).length;
        styledCountArray.push(styledCount);
      });

      return {
        keysArray: keys,
        valuesArray: valuesArray,
        maxArray: maxArray,
        minArray: minArray,
        avgArray: avgArray,
        styledCountArray: styledCountArray,
      };
    },
  },
};
</script>

<style scoped>
.analysis-result {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  display: flex;
  justify-content: start;
  .chart-container {
    margin-right: 20px;
    width: 600px;
  }

  .table-container {
    margin-left: 20px;
    /* 占据剩下的空间 */

    flex: 1;
  }
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
  margin-left: 20px;
}

.select-label {
  display: block;
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
  margin-left: 20px;
}

.chart-select {
  width: 100%;
  max-width: 300px;
  margin-left: 20px;
}
</style>
