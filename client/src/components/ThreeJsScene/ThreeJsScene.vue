<template>
  <div class="three-container">
    <div ref="container1" class="container1">
      <div id="gui-container"></div>
    </div>

    <div class="right-container">
      <div class="container_div">
        <div ref="container2" class="container2"></div>
      </div>
      <div class="slider-container">
        <div class="block">
          <span class="demonstration">深度：{{ value }}米</span>
          <el-slider
            :min="0"
            :max="3"
            :step="0.1"
            @input="valueChange"
            v-model="value"
          ></el-slider>
        </div>
        <div>
          <span class="demonstration">类型：</span>
          <el-select v-model="type" placeholder="请选择" @change="typeChange">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { init, updateScene, changeScene } from "./js/Three";

export default {
  name: "threedimensional",
  data() {
    return {
      value: 0,
      Options: this.$store.getters.getChartConfig,
      types: [],
      type: "",
      normalizedConfig: {},
    };
  },
  mounted() {
    console.log(this.Options);
      const keyMap = {
        "PH":"PH值",
        "As": "砷",
        "Cd": "镉",
        "Cu": "铜",
        "Pb": "铅",
        "Hg": "汞",
        "Ni": "镍",
        "Cr": "六价铬",
      };

      for (const key in this.Options) {
        const translatedKey = keyMap[key] || key;
        this.types.push({ value: key, label: translatedKey });
      }

      this.type = this.types[0].value;
      this.normalizedConfig = this.normalizeConfig(this.Options);
      console.log(this.Options)
console.log(this.normalizedConfig);
      init(
        this.$refs.container1,
        this.$refs.container2,
        this.value - 1.5,
        this.normalizedConfig[this.type]
      );
  },
  methods: {
    valueChange() {
      updateScene(
        this.$refs.container1,
        this.$refs.container2,
        this.value - 1.5
      );
    },
    typeChange() {
      console.log(this.type);
      console.log(this.normalizedConfig);
      changeScene(
        this.$refs.container1,
        this.$refs.container2,
        this.value - 1.5,
        this.normalizedConfig[this.type]
      );
    },
    normalizeConfig(config) {
      const normalizedConfig = {};
      for (const key in config) {
        if (Array.isArray(config[key])) {
          const maxVal = Math.max(...config[key]);
          const minVal = Math.min(...config[key]);
          normalizedConfig[key] = config[key].map(
            (val) => (val - minVal) / (maxVal - minVal)
          );
        }
      }
      return normalizedConfig;
    },
  },
};
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  display: flex;
  .right-container {
    flex-grow: 1; /* 设置右边div的宽度为剩余空间 */
    display: flex; /* 设置右边div为flex布局 */
    flex-direction: column; /* 设置右边div的子元素竖直排列 */
    /* 设置右边div的子元素水平居中排列 */

    align-items: center;
    .slider-container {
      .block {
        width: 300px;
      }
    }
    .container_div {
      height: 50%;
      .container2 {
        width: 250px;
        height: 250px;
        margin-top: 30px;
      }
    }
  }
}
#gui-container {
  position: absolute;
  top: 200px;
  right: 10px;
}
.container1 {
  width: 50%;
  height: 100%;
  position: relative;
}
</style>
