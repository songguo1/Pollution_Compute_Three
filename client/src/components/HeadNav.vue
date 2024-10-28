<template>
  <header class="head-nav">
    <div class="l-content">
      <img src="../assets/images/logo.png" alt="" class="logo" />

      
    </div>
    <div class="r-content">
      <div class="userinfo">
        <img src="../assets/images/user-default.png" alt="" class="avatar" />
        <div class="welcome">
          <p class="name comename">欢迎</p>
          <p class="name avatarname">{{ user.name }}</p>
        </div>
        <span class="username">
          <!-- 下拉箭头 -->
          <el-dropdown trigger="click" @command="setDialogInfo">
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom"></i>
            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="info">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </div>
  </header>
</template>

<script>

export default {
  name: "HeadNav",

  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    setDialogInfo(cmdItem) {
      switch (cmdItem) {
        case "info":
          this.showInfoList();
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    showInfoList() {
      if (this.$route.path !== "/infoshow") {
        this.$router.push("/infoshow");
      }

    },
    logout() {
      //清除token
      localStorage.removeItem("mytoken");
      //设置vuex store
      this.$store.dispatch("clearCurrentState");
      this.$router.push('/login')
    },
  },
};
</script>

<style lang="less" scoped>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 600px;
  padding: 5px;
  background: #318fa0;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;

  .l-content {
    float: left;
    display: flex;
    align-items: center;
    .logo {
      width:404px;
      height: 50px;
      vertical-align: top;
    }
    .title {
      padding-left: 8px;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .r-content {
    float: right;
    margin-right: 50px;
    .userinfo {
      display: flex;
      align-items: center;
      height: 60px;
      .avatar {
        width: 40px;
        height: 40px;
      }

      .welcome {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 10px;
        .name {
          font-weight: 500;
          font-size: 14px;
          margin-right: 10px;
        }

        .avatarname {
          color: skyblue;
          padding-top: 5px;
        }
      }

      .username {
        .el-dropdown {
          color: #fff;
        }
      }
    }
  }
}
</style>
