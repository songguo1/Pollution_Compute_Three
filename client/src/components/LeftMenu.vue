<template>
  <el-row class="menu_page">
    <el-col>
      <el-menu
        mode="vertical"
        background-color="#324057"
        text-color="#fff"
        active-text-color="#409eff"
        class="el-menu-vertical-demo"
        :router='true'

        :default-active="$route.path"
      >
        <router-link to="/home">
          <el-menu-item index="0">
            <template slot="title">
              <i class="icon fa fa-map"></i>

              <span slot="title">首页</span>
            </template>
          </el-menu-item>
        </router-link>
        <template v-for="item in items">
          <el-menu-item
            v-if="item"
            :index="'/'+item.path"
            :key="item.path"
            router=true
          >
            <template slot="title">
              <i :class="'icon fa ' + item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </template>
          </el-menu-item>

          <!-- <template  v-for="item in items" >
                    <el-submenu v-if="item.children" :index="item.path" :key="item.path">
                        <template slot="title">
                          
                          <i :class="'icon fa '+item.icon" ></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <router-link v-for="(citem,cindex) in item.children" 
                            :to="citem.path" :key="cindex">
                            <el-menu-item 
                                :index='citem.path'>
                                <span slot="title">{{citem.name}}</span>
                            </el-menu-item> 
                        </router-link>
                    </el-submenu> -->
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "leftmenu",

  data() {
    return {
      items: [
        {
          icon: "fa-table",
          name: "项目列表",
          path: "projectlist",
          // children: [
          //   {
          //     path: "projectlist",
          //     name: "项目管理",
          //   },
            //可以添加其他元素
          // ],
        },
        {
          icon: "fa-file-text",
          name: "污染分析",
          path: "pollutionanalysis",
          // children:[{
          //   path:'PollutionAnalysis',
          //   name:'污染分析'
          // }]
        },
        {
          icon: "fa-cube",
          name: "污染剖面",
          path: "threedimensional",
          // children:[{
          //   path:'infoshow',
          //   name:'污染剖面'
          // }]
        },
        {
          icon: "fa-user-circle",
          name: "用户信息",
          path: "infoshow",
          // children:[{
          //   path:'infoshow',
          //   name:'个人信息'
          // }]
        },
      ],
    };
  },
};
</script>

<style land="less" scoped>
.menu_page {
  position: fixed;
  top: 60px;
  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 99;
}
.el-menu {
  border: none;
}
.icon {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>
