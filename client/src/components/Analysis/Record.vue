<template>
  <div class="record">
    <div v-show='Visible' v-for="(item, index) in FileList" :key="index">
      <el-divider content-position="left">{{ item.date }}</el-divider>
      <img src="@/assets/images/file.jpg" alt="" style="width:50px;height:50px;margin-right:10px;"></img>
      <span>{{ item.filename }}</span>
      <a :href="item.path" class="download-link">下载</a>
    </div>
    <!-- 添加一个无数据时显示的提示 -->

    <div v-show="!Visible">
      <p>暂无记录</p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {

  name: "Record",
  components: {},
  data() {
    return {
      Visible: true,
      FileList:null,
    };
  },

  created() {
    this.GetRecord();
  },


  methods: {
    GetRecord() {
      this.$axios
        .post("/file/fileList", {
          code: this.$route.params.code,
          user: this.$store.getters.user.name,
        })
        .then((res) => {
          console.log(res.data);
  
          this.FileList = res.data;
          if (this.FileList.status == 1) {
            this.Visible = false;
            return;
          }
          this.Visible = true;
          this.FileList.forEach((item) => {
            item.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
          });
        });
    },
  },
};
</script>

<style>
.record {
  .download-link {
    color: #7ed3f0; /* 设置链接颜色 */
    text-decoration: none; /* 去掉下划线 */

  }

  .download-link:hover {
    text-decoration: underline; /* 鼠标悬停时显示下划线 */
  }

}
</style>
