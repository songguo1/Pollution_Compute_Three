<template>
  <div class="login">
    <div class="login_container"></div>
    <section class="form_container">
      <div class="manage_tip">
        <img
          src="@/assets/images/logo.png"
          alt=""
          style="width: 550px; height: 70px"
        />
        <div class="title">登录</div>
      </div>
      <el-form
        :model="loginUser"
        :rules="rules"
        class="loginForm"
        ref="loginForm"
        label-width="100px"
      >
        <el-form-item class="item" prop="name">
          <span slot="label">
            <span style="color: white">用户名</span>
          </span>
          <el-input
            v-model="loginUser.name"
            placeholder="请输入用户名"
            style="opacity: 0.8"
          ></el-input>
        </el-form-item>

        <el-form-item class="item" prop="password">
          <span slot="label">
            <span style="color: white">密码</span>
          </span>
          <el-input
            v-model="loginUser.password"
            placeholder="请输入密码"
            type="password"
            style="opacity: 0.8"
          >
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="submit_btn"
            @click="submitForm('loginForm')"
            >登 录</el-button
          >
        </el-form-item>
        <div class="tiparea">
          <p>还没有账号？现在<router-link to="/register">注册</router-link></p>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";
export default {
  name: "Login",
  data() {
    return {
      loginUser: {
        name: "",
        // email: "",
        password: "",
        // password2: "",
        // identity: ""
      },
      rules: {
        name: [
          { required: true, message: "用户名不能为空", trigger: "change" },
          {
            min: 2,
            max: 30,
            message: "长度在 2 到 30 个字符",
            trigger: "blur",
          },
        ],

        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 30,
            message: "长度在 6 到 30 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      //获取表单元素
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/user/login", this.loginUser)
            .then((res) => {
              const { token } = res.data;
              // console.log(token)
              localStorage.setItem("mytoken", token);

              // 解析token
              const decode = jwtDecode(token);
              console.log(decode);

              // 将解析后的token存入vuex中
              this.$store.dispatch("setIsAutnenticated", !this.isEmpty(decode));

              this.$store.dispatch("setUser", decode);

              this.$router.push("/");
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("登录失败，请检查用户名及密码是否正确！");
            });
        } else {
          this.$message({
            type: "error",
            message: "错误提交申请",
          });
          return false;
        }
      });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(237, 237, 237);
  opacity: 0.7;
  position: absolute;
  top: 18%;

  left: 450px;
  width: 40%;
  height: 70%;
  border: 4px solid #6c73ee; /* 增加边框样式和颜色 */
  border-radius: 10px; /* 稍微增加圆角 */
  box-shadow: 0px 16px 16px rgba(0, 0, 0, 0.8); /* 调整阴影效果 */
}

.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../../assets/images/background.jpg) no-repeat center center;
  background-size: 100% 100%;
  .loginForm {
    position: relative;
    left: 70px;
  }
}

.form_container {
  // width: 370px;
  // height: 210px;
  position: absolute;

  padding: 25px;
  border-radius: 5px;
  text-align: center;
  left: 30%;
  top: 20%;
  // background-color: #fff;
  // opacity: 0.5;
}

.form_container .manage_tip .title {
  font-family: "SimSun", "宋体", sans-serif;
  font-weight: bold;

  font-size: 33px;
  color: #1c2677;
}

.loginForm {
  margin-top: 20px;
  // background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
  background-color: rgb(94, 90, 90);
  opacity: 0.7;
  width: 400px;
}

.submit_btn {
  width: 100%;
}

.tiparea {
  text-align: right;
  font-size: 12px;
  color: #fff;
}

.item .el-form-item__label {
  color: #fff;
}

.tiparea p a {
  color: #409eff;
}

// 改变input里的字体颜色
/deep/input::-webkit-input-placeholder {
  color: white;
  font-size: 15px;
}

// 改变input框背景颜色
/deep/.el-input__inner {
  background-color: transparent !important;
  // background-color:#4d4f50;
  color: white; // 输入字体颜色
  // opacity: 0.5;
}
</style>
