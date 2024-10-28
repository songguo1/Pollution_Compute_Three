<template>
    <div class="infoshow">
        <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="8">
            <div class="user">
                <img src="../../assets/images/user-default.png" class="avatar" alt="">
            </div>
        </el-col>
            <el-col :span="16">
            <div class="userinfo">
                <div class="user-item">
                    <i class="fa fa-user"></i>
                    <span>{{ user.name }}</span>
                </div>
                <div class="user-item">
                    <i class="fa fa-cog">
                        
                    </i>
                    <span>{{user.identity== '0' ? '管理员':"普通员工"}}</span>
                </div>
            </div>
            </el-col>
        </el-row>
        
    </div>
</template>

<script>
export default{
    name:'infoshow',
    computed:{
        user(){
            return this.$store.getters.user
        }
    },
    components:{}
}
</script>

<style lang="less" scoped>
.infoshow {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-left: 200px;
  display: flex;
.row-bg{
    width:100%;
    height:100%
}
  .user {
    
    text-align: center;
    position: relative;
    top: 30%;
    img {
      width: 150px;
      border-radius: 50%;
    }
  }

  .userinfo {
    flex: 1;
    height: 100%;
    background-color: #eee;
    span {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
    }

    .user-item {
      position: relative;
      top: 30%;
      padding: 26px;
      font-size: 28px;
      color: #333;
      display: flex;
      align-items: center;

      .icon {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>