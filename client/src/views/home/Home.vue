<template>
  <div id="mapview">
    <!-- 将sekectedItem传递给LeftMenu组件 -->
    <LeftMenu :selectedItem="selectedItem"></LeftMenu>
    <!-- <button @click="startDrawingPolygon">Start Drawing Polygon</button> -->
    <div v-show="bufferVisible" class="input-box">
      <div class="input-item">缓冲区半径（千米）：</div>
      <el-input
        class="input-num"
        type="number"
        v-model="input"
        placeholder=""
      ></el-input>
      <el-button class="clear-btn" type="primary" @click="clearBuffer"
        >清空缓冲区</el-button
      >
      <el-button class="clear-btn" type="primary" @click="cancelBuffering"
        >取消绘制</el-button
      >
    </div>
    <div v-show="chartVisible">
      <div style="width: 600px; height: 400px" id="chart"></div>
      <div
        style="
          z-index: 999;
          position: absolute;
          bottom: 380px;
          right: 10px;
          cursor: pointer;
        "
        @click="chartVisible = false"
      >
        <i class="el-icon-close"></i>
      </div>
    </div>

    <!-- 从子组件接受数据 -->
    <div>
      <MapButton
        @changeBasemap="changeBasemap"
        @clickItem="handleClickItem"
        @addBuffer="addBuffer"
        @showRecord="ShowRecord"
      ></MapButton>
    </div>

    <div id="scalebar"></div>
    <el-dialog
      title="历史记录"
      :visible.sync="showRecord"
      customClass="customWidth"
    >
      <Record :selectedItem="selectedItem"></Record>
    </el-dialog>
  </div>
</template>

<script>
import "@arcgis/core/assets/esri/themes/light/main.css";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import TileLayer from "@arcgis/core/layers/TileLayer";
import Basemap from "@arcgis/core/Basemap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import WFSLayer from "@arcgis/core/layers/WFSLayer";

import Point from "@arcgis/core/geometry/Point";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

import Draw from "@arcgis/core/views/draw/Draw.js";
import Graphic from "@arcgis/core/Graphic";

import LeftMenu from "../../components/MapComponent/LeftMenu";
import MapButton from "../../components/MapComponent/MapButton";
import Record from "../../components/MapComponent/Record";
import { init } from "echarts";

export default {
  name: "MapView",
  components: { MapButton, LeftMenu, Record },
  data() {
    return {
      showRecord: false,
      chartVisible: false,
      map: null,
      mapTileLayer: null,
      view: null,
      tableData: [],
      //选中的项目
      selectedItem: {},
      // 绘制的多边形
      draw: null,
      graphicsLayer: null,
      input: 10,
      clickHandler: null, // 用于保存点击事件侦听器

      bufferVisible: false,
      pointGraphicLayer: null,
      FeatureLayer: null,
    };
  },
  mounted() {
    this.initMap();
  },

  methods: {
    ShowRecord() {
      if (!this.selectedItem.code) {
        this.$message.error("请先选择项目");
        return;
      }
      this.showRecord = true;
    },
    initMap() {
      const { name } = this.$store.getters.user;
      const userdata = {
        name,
      };
      this.$axios
        .post("/proj/all", userdata)
        .then((res) => {
          this.tableData = res.data;
          this.createMapView();
        })
         .catch((err) => {
            console.log(err);
          });
    },
    cancelBuffering() {
      this.bufferVisible = false;
      //绘制缓冲区事件取消
      // 取消点击事件侦听器
      if (this.clickHandler) {
        this.clickHandler.remove();
        this.clickHandler = null;
      }
      this.graphicsLayer.removeAll();
    },

    clearBuffer() {
      this.graphicsLayer.removeAll();
    },
    //添加缓冲区

    addBuffer() {
      this.bufferVisible = true;
      this.graphicsLayer = new GraphicsLayer();
      this.map.add(this.graphicsLayer);
      //拖动点图标到地图上，选中图标

      this.clickHandler = this.view.on("click", (event) => {
        var point = new Point({
          latitude: event.mapPoint.latitude,
          longitude: event.mapPoint.longitude,

          spatialReference: { wkid: 4326 },
        });

        var markerSymbol = new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2,
          },
        });

        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
        });

        this.graphicsLayer.add(pointGraphic);

        // 创建一个缓冲区
        try {
          // 其他的代码...
          var bufferarea = geometryEngine.geodesicBuffer(
            point,
            `${this.input}`,
            "kilometers"
          );
          // 其他的代码...
        } catch (error) {
          console.error("An error occurred while buffering:", error);
          // 进行适当的错误处理
        }

        // 将缓冲区添加到图形层
        var bufferGraphic = new Graphic({
          geometry: bufferarea,
          symbol: {
            type: "simple-fill",
            color: [0, 255, 255, 0.1],
            outline: {
              color: [255, 255, 255],
              width: 1,
            },
          },
        });

        this.graphicsLayer.add(bufferGraphic);
        // 创建一个裁剪区域
        // const clippedGeometry = geometryEngine.clip(
        //   this.tileLayer.fullExtent,
        //   bufferarea
        // );

        // // 将裁剪区域转换为图形并添加到图形层
        // if (clippedGeometry) {
        //   const clippedGraphic = new Graphic({
        //     geometry: clippedGeometry,
        //     symbol: {
        //       type: "simple-fill",
        //       color: [255, 0, 0, 0.5],
        //       outline: {
        //         color: [255, 255, 255],
        //         width: 1,
        //       },
        //     },
        //   });

        //   this.graphicsLayer.add(clippedGraphic);
        // }
      });

      this.clickHandler;
    },
    createMapView() {
      try {
        // 底图使用的切片图层
        // this.mapTileLayer = new TileLayer({
        //   url: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity_Mobile/MapServer",
        // });
        // 创建地图Map

        // this.map = new Map({
        //   basemap:  [this.mapTileLayer],
        // });

        let FeaturemapLayer = new FeatureLayer({
          url: "http://localhost:6080/arcgis/rest/services/jiangsu/MapServer",
        });

        // this.map = new Map({
        //   // basemap: "topo-vector",
        //   basemap: "dark-gray",
        // });
        // 天地图的瓦片服务URL
        const tiandituLayer = new WebTileLayer({
          urlTemplate:
            "http://{subDomain}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=",
          subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        });

        // 天地图的矢量注记瓦片服务URL
        const tiandituAnnotationLayer = new WebTileLayer({
          urlTemplate:
            "http://{subDomain}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=",
          subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        });

        this.map = new Map({
          basemap: {
            baseLayers: [tiandituLayer],
          },
        });
        // this.FeatureLayer = new FeatureLayer({
        //   url: "http://localhost:6080/arcgis/rest/services//MyMapService/MapServer",
        // });

        this.view = new MapView({
          container: "mapview",
          center: [119.923, 32.51],
          map: this.map,
          zoom: 7,
        });
        this.map.add(FeaturemapLayer);
        this.map.add(tiandituAnnotationLayer);

        //添加点
        FeaturemapLayer.renderer = new SimpleRenderer({
          symbol: new SimpleFillSymbol({
            color: [173, 216, 230, 0.1], // 透明颜色，最后一个参数为透明度
            outline: {
              color: [128, 128, 128],
              width: 2,
            },
          }),
        });
        let popupTemplate;
        // 在添加新的图形之前清除旧的图形
        this.view.graphics.removeAll();
        this.pointGraphicLayer = new GraphicsLayer();
        this.map.add(this.pointGraphicLayer);
        if (this.tableData.length !== 0) {
          this.tableData.forEach((item) => {
            const point = {
              type: "point",
              longitude: Number(item.lon),
              latitude: Number(item.lat),
            };
            let symbol;
            if (item.progress === "进行中" && item.type == "水体") {
              symbol = {
                type: "picture-marker",
                url: require("../../assets/images/marker/water_ongoing.png"),
                width: "30px",
                height: "39px",
              };
              //添加信息框
              popupTemplate = {
                title: item.name,
                content: `
              <div>
                <p>类型：${item.type}</p>
                <p>进度：${item.progress}</p>
            
              </div>
              `,
              };
            } else if (item.progress === "进行中" && item.type == "土壤") {
              symbol = {
                type: "picture-marker",
                url: require("../../assets/images/marker/soil_ongoing.png"),
                width: "30px",
                height: "39px",
              };
              //添加信息框
              popupTemplate = {
                title: item.name,
                content: `
              <div>
                <p>类型：${item.type}</p>
                <p>进度：${item.progress}</p>
          
              </div>
              `,
              };
            } else if (item.progress === "已完成" && item.type == "水体") {
              symbol = {
                type: "picture-marker",
                url: require("../../assets/images/marker/water_completed.png"),
                width: "30px",
                height: "39px",
              };
              //添加信息框
              popupTemplate = {
                title: item.name,
                content: `
              <div>
                <p>类型：${item.type}</p>
                <p>进度：${item.progress}</p>

         
              </div>
              `,
              };
            } else if (item.progress === "已完成" && item.type == "土壤") {
              symbol = {
                type: "picture-marker",
                url: require("../../assets/images/marker/soil_completed.png"),
                width: "30px",
                height: "39px",
              };
              //添加信息框
              popupTemplate = {
                title: item.name,
                content: `
              <div>
                <p>类型：${item.type}</p>
                <p>进度：${item.progress}</p>
      
              </div>
              `,
              };
            }

            // 添加点
            const graphic = new Graphic({
              geometry: point,
              symbol: symbol,
              popupTemplate: popupTemplate,
              attribute: item,
            });

            this.pointGraphicLayer.add(graphic);
            //点击每个点后将item存在this.selectedItem中

            this.$store.commit("_setDefaultMapView", this.view);
          });
        }

        // this.view.on("click", (event) => {
        //   // 使用点击事件的屏幕坐标来查询图形层
        //   this.view.hitTest(event.screenPoint).then((response) => {
        //     // 检查是否有图形被点击
        //     if (response.results.length) {
        //       const graphic = response.results.find(
        //         (r) => r.graphic.layer === this.pointGraphicLayer
        //       ).graphic;
        //       // 这里可以对选中的图形进行处理
        //       this.selectedItem = graphic.attribute;
        //     }
        //   });
        // });
        this.view.on("click", (event) => {
          // 使用点击事件的屏幕坐标来查询图形层
          this.view
            .hitTest(event.screenPoint)
            .then((response) => {
              // 检查是否有图形被点击
              if (response.results && response.results.length) {
                const graphic = response.results.find(
                  (r) => r.graphic && r.graphic.layer === this.pointGraphicLayer
                );
                if (graphic && graphic.graphic) {
                  // 这里可以对选中的图形进行处理
                  this.selectedItem = graphic.graphic.attribute;
                } else {
                  console.log("No matching graphic found");
                }
              } else {
                console.log("No results found");
              }
            })
            .catch((error) => {
              console.error("Error during hitTest:", error);
            });
        });
      } catch (err) {
        console.error(err);
      }
    },
    //点击接受子组件数据
    handleClickItem(item) {
      this.view.center = [Number(item.lon), Number(item.lat)];
      this.view.zoom = 15;
    },
    startDrawingPolygon() {
      // 初始化绘图工具
      this.draw = new Draw({ view: this.view });

      // 开始监听绘制多边形的行为
      const action = this.draw.create("polygon", { mode: "click" });

      // 使用箭头函数确保 this 指向正确
      action.on("vertex-add", (evt) => {
        this.measureLine(evt.vertices);
      });

      action.on("cursor-update", (evt) => {
        this.measureLine(evt.vertices);
      });

      action.on("draw-complete", (evt) => {
        this.measureLine(evt.vertices);
      });

      action.on("vertex-remove", (evt) => {
        this.measureLine(evt.vertices);
      });
    },
    // ... 其他代码 ...

    measureLine(vertices) {
      this.view.graphics.removeAll();

      let line = this.createLine(vertices);

      let graphic = new Graphic({
        geometry: line,
        symbol: {
          type: "simple-line",
          color: "red",
          width: 2,
        },
      });
      this.view.graphics.add(graphic);
    },

    createLine(vertices) {
      let polyline = {
        type: "polyline",
        paths: vertices,
        spatialReference: this.view.spatialReference,
      };
      return polyline;
    },
    //切换底图
    changeBasemap(basemap) {
      const tiandituLayer = new WebTileLayer({
        urlTemplate: basemap.url,
        subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      });
      this.map.basemap.baseLayers = [tiandituLayer];
    },
  },
};
</script>

<style>
/* CSS url as a string */

#mapview {
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  #chart {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 600px;
    height: 400px;
    background-color: rgb(204, 218, 230);
    border: 1px solid #ccc;
  }
  .el-dialog__body{
    padding:10px 20px!important;
  }
  .input-box {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 600px;
    height: 70px;
    top: 100px;
    right: 70px;
    background-color: rgb(223, 228, 225);
    border: 1px solid #ccc;
  }
  .clear-btn {
    margin: 14px;
  }
  .input-item {
    margin-top: 24px;
    /* 好看的字体 */

    font-family: "SimHei";
    /* 粗体 */

    font-weight: bold;

    margin-left: 5px;
  }
  .input-num {
    margin-top: 12px;
    width: 120px;
  }
}
#scalebar {
  position: absolute;
  bottom: 25px;
  left: 15px;
}
/* 移除地图边框 */

.esri-view {
  --esri-view-outline: none !important;
}

.esri-popup__inline-actions-container {
  display: none;
}
</style>
