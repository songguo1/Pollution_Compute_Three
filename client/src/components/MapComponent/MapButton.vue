<template>
  <div>
    <div class="nav">
      <div class="nav-wrapper">
        <div class="nav-item" @click="ShowList()">
          <a class="alink">
            <span>项目信息</span>
            <!-- <img src="../../assets/images/drop.png" alt=""> -->
          </a>
          <!-- <div class="nav-drop-down-wrapper">
            <div class="nav-drop-down">
              <div
                v-for="proj in projs"
                :key="proj.id"
                :value="proj.id"
                class="down-item"
              >
                <div  @click="ShowList(proj.id)" class="down-item-wrapper">
                  {{ proj.name }}
                </div>
              </div>
            </div>
          </div> -->
        </div>
        <div class="nav-item">
          <a class="alink">
            <span>地图服务</span>
            <img src="../../assets/images/drop.png" alt="" />
          </a>
          <div class="nav-drop-down-wrapper">
            <div class="nav-drop-down">
              <div
                v-for="basemap in basemaps"
                :key="basemap.id"
                :value="basemap.id"
                class="down-item"
              >
                <div @click="changeBasemap(basemap)" class="down-item-wrapper">
                  {{ basemap.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 点击后触发父组件事件 -->
        <!-- <div class="nav-item" @click="$emit('addBuffer', '')">
          <a class="alink">
            <span>缓冲区</span>
            <img src="./asset/drop.png" alt="">
          </a>
          <div class="nav-drop-down-wrapper">
            <div class="nav-drop-down">
                        <div class="down-item">
                            <div class="down-item-wrapper">
                                <span>3️⃣SAN</span>
                            </div>
                        </div>
                    </div>
          </div>
        </div> -->
        <div class="nav-item" @click="$emit('showRecord')">
          <a class="alink">
            <span>历史数据</span>
            <!-- <img src="./asset/drop.png" alt=""> -->
          </a>
          <!-- <div class="nav-drop-down-wrapper">
                    <div class="nav-drop-down">
                        <div class="down-item">
                            <div class="down-item-wrapper">
                                <span>⛓️LIAN</span>
                            </div>
                        </div>
                    </div>
                </div> -->
        </div>
        <!-- <div class="nav-item">
          <a class="alink">
            <span>Started</span> -->
        <!-- <img src="./asset/drop.png" alt=""> -->
        <!-- </a> -->
        <!-- <div class="nav-drop-down-wrapper">
                    <div class="nav-drop-down">
                        <div class="down-item">
                            <div class="down-item-wrapper">
                                <img src="./asset/QQ.png" alt="">
                                <span>QQ</span>
                            </div>
                        </div>
                        <div class="down-item">
                            <div class="down-item-wrapper">
                                <img src="./asset/WeChat.png" alt="">
                                <span>WeChat</span>
                            </div>
                        </div>
                        <div class="down-item">
                            <div class="down-item-wrapper">
                                <img src="./asset/GitHub.png" alt="">
                                <span>GitHub</span>
                            </div>
                        </div>
                    </div>
                </div> -->
        <!-- </div> -->
      </div>
    </div>

    <el-drawer
      :modal-append-to-body="false"
      :modal="false"
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
    >
      <el-tabs v-model="activeName" type="border-card" @tab-click="projClick">
        <el-tab-pane name="soil_ongoing">
          <template #label>
            <span>土壤类</span>
            <span style="color: red">（进行中）</span>
          </template>
          土壤类（进行中）
          <img
            src="@/assets/images/marker/soil_ongoing.png"
            style="width: 30px; height: 40px; margin-left: 10px"
            alt=""
          />
        </el-tab-pane>
        <el-tab-pane name="soil_finished">
          <template #label>
            <span>土壤类</span>
            <span style="color: green">（已完成）</span>
          </template>
          土壤类（已完成）
          <img
            src="@/assets/images/marker/soil_completed.png"
            style="width: 30px; height: 40px; margin-left: 10px"
            alt=""
          />
        </el-tab-pane>
        <el-tab-pane name="water_ongoing">
          <template #label>
            <span>水体类</span>
            <span style="color: red">（进行中）</span>
          </template>
          水体类（进行中）
          <img
            src="@/assets/images/marker/water_ongoing.png"
            style="width: 30px; height: 40px; margin-left: 10px"
            alt=""
          />
        </el-tab-pane>
        <el-tab-pane name="water_finished">
          <template #label>
            <span>水体类</span>
            <span style="color: green">（已完成）</span>
          </template>
          水体类（已完成）
          <img
            src="@/assets/images/marker/water_completed.png"
            style="width: 30px; height: 40px; margin-left: 10px"
            alt=""
          />
        </el-tab-pane>
      </el-tabs>
      <ul class="infinite-list" style="overflow: auto">
        <li
          @click="handleClick(item)"
          v-for="item in tableData"
          :key="item.id"
          class="infinite-list-item"
        >
          <!-- 图片-->
          <img :src="item.imageUrl" alt="项目图片" class="item-image" />
          <!-- 文本信息 -->
          <!-- 点击后传递数据给父组件 -->
          <div class="item-info">
            <!-- 点击每个p标签，触发事件 -->

            <p>
              项目名称：<span>{{ item.name }}</span>
            </p>
            <p>
              项目地址：<span>{{ item.address }}</span>
            </p>
            <p>
              负责人：<span>{{ item.manager }}</span>
            </p>
          </div>
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
import Record from "@/components/Analysis/Record.vue";
export default {
  data() {
    return {
      drawer: false,
      activeName: "soil_ongoing",
      soil_ongoing: [],
      soil_finished: [],
      water_ongoing: [],
      water_finished: [],
      tableData: [],
      basemaps: [
        {
          id: "默认底图",
          name: "默认底图",
          url: "http://{subDomain}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=1ba928ced7f95e4a6c5dcf7e348d36ef",
        },
        {
          id: "影像底图",
          name: "影像底图",
          url: "http://{subDomain}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=1ba928ced7f95e4a6c5dcf7e348d36ef",
        },

        {
          id: "地形晕渲",
          name: "地形晕渲",
          url: "http://{subDomain}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=1ba928ced7f95e4a6c5dcf7e348d36ef",
        },

        // 添加更多底图选项
      ],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    projClick(tab) {
      if (tab.name === "soil_ongoing") {
        this.tableData = this.soil_ongoing;
      } else if (tab.name === "soil_finished") {
        this.tableData = this.soil_finished;
      } else if (tab.name === "water_ongoing") {
        this.tableData = this.water_ongoing;
      } else if (tab.name === "water_finished") {
        this.tableData = this.water_finished;
      }
    },
    handleClick(item) {
      this.$emit("clickItem", item);
    },
    ShowList() {
      this.drawer = true;
      this.projClick({ name: this.activeName });
    },
    getList() {
      const { name } = this.$store.getters.user;
      const userdata = {
        name,
      };
      this.$axios
        .post("/proj/all", userdata)
        .then((res) => {
          const Data = res.data;
          // 筛选出this.tableData中土壤类（进行中）的数据存入soil_ongoing数组
          this.soil_ongoing = Data.filter(
            (item) => item.type === "土壤" && item.progress === "进行中"
          );
          // 筛选出this.tableData中土壤类（已结束）的数据存入soil_finished数组
          this.soil_finished = Data.filter(
            (item) => item.type === "土壤" && item.progress === "已完成"
          );
          // 筛选出this.tableData中水体类（进行中）的数据存入water_ongoing数组
          this.water_ongoing = Data.filter(
            (item) => item.type === "水体" && item.progress === "进行中"
          );
          // 筛选出this.tableData中水体类（已结束）的数据存入water_finished数组
          this.water_finished = Data.filter(
            (item) => item.type === "水体" && item.progress === "已完成"
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },

    changeBasemap(basemap) {
      this.$emit("changeBasemap", basemap);
    },
  },
};
</script>

<style>
@import url("../../assets/scss/style.css");
/* 添加Flexbox样式 */
.infinite-list-item {
  display: flex;
  align-items: center; /* 垂直居中 */
  margin: 10px; /* 添加底部边距 */
  /* 添加边框 */
  border: 1px solid #0f100f;
  border-radius: 4px;
  padding: 10px; /* 内边距 */
  /* 鼠标移到该位置后，背景颜色变为蓝色 */
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.infinite-list-item:hover {
  background-color: #e6f7ff;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  margin-right: 20px; /* 图片和文本之间的间距 */
}

.item-info {
  flex-grow: 1; /* 让文本部分占据剩余空间 */
}

/* 添加其他样式 */
.infinite-list-item p {
  margin: 20px; /* 去除默认的margin */
}

.infinite-list-item span {
  font-weight: bold;
  color: #007bff;
}
</style>
