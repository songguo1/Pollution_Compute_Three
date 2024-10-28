<template>
  <div class="register">
    <div class="register_container"></div>
    <section class="form_container">
      <div class="manage_tip">
        <img
          src="@/assets/images/logo.png"
          alt=""
          style="width: 550px; height: 70px"
        />
        <div class="title">注册</div>
      </div>

      <el-form
        :model="registerUser"
        :rules="rules"
        ref="registerForm"
        label-width="100px"
        class="registerForm"
      >
        <el-form-item label="用户名" prop="name">
          <span slot="label">
            <span style="color: white">用户名</span>
          </span>
          <el-input
            v-model="registerUser.name"
            placeholder="请输入用户名"
            style="opacity: 0.8"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <span slot="label">
            <span style="color: white">密码</span>
          </span>
          <el-input
            type="password"
            v-model="registerUser.password"
            placeholder="请输入密码"
            style="opacity: 0.8"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="comfirempassword">
          <span slot="label">
            <span style="color: white">确认密码</span>
          </span>
          <el-input
            type="password"
            v-model="registerUser.comfirempassword"
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="submit_btn"
            @click="submitForm('registerForm')"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  name: "register",
  components: {},
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerUser: {
        name: "",
        password: "",
        //password2: "",
        comfirempassword: "",
        identity: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
          {
            min: 2,
            max: 30,
            message: "长度为2到30个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 30,
            message: "长度在6到30之间",
            trigger: "blur",
          },
        ],
        comfirempassword: [
          {
            required: true,
            message: "确认密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 30,
            message: "长度在6到30之间",
            trigger: "blur",
          },
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      console.log(this.registerUser);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/user/register", this.registerUser)

            .then((res) => {
              this.$message.success("恭喜，注册成功！");
              this.$router.push("/login");
            })
            .catch((err) => {
              // console.log(err)
              this.$message.error("注册失败！");
              console.log(err);
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
  },
};
</script>

<style lang="less" scoped>
.register {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../../assets/images/background.jpg) no-repeat center center;
  background-size: 100% 100%;
  .regiterForm {
    position: relative;
    left: 70px;
  }
}
.registerForm{
  margin-top: 20px;
  margin-left:70px;
  // background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
  background-color: rgb(94, 90, 90);
  opacity: 0.7;
  width: 400px;
}
.register_container{
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
  color: rgb(255, 255, 255); // 输入字体颜色
  // opacity: 0.5;
  //border: 1px solid white;
}
</style>
