<template>
  <div class="DataImport">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="项目编号" prop="code">
        <el-select
          @change="selectchange"
          v-model="ruleForm.code"
          placeholder="请选择项目"
        >
          <el-option
            v-for="item in listObj"
            :key="item.code"
            :label="item.code"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="上传照片">
            <el-upload
              class="avatar-uploader"
              name="image"
              action="http://127.0.0.1:3000/api/image/upload"
              :show-file-list="false"
              :headers="headerObj"
              :data="DataForm"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item label="上传Excel">
            <el-upload
              class="upload-demo"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
              :before-upload="beforeFileUpload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__text">只能上传excel文件</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="坐标经度" prop="lon" required>
            <el-input v-model="ruleForm.lon"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="坐标纬度" prop="lat" required>
            <el-input v-model="ruleForm.lat"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="项目信息" prop="message" required>
        <el-input type="textarea" v-model="ruleForm.message"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >立即上传</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        message: "",
        excel: "",
        lon: "",
        lat: "",
        name: "",
        code: "",
      },
      name: "",
      listObj: {},
      imageUrl: "",
      //图片上传组件的headers请求头对象
      headerObj: {
        Authorization: localStorage.getItem("mytoken"),
      },
      value: "",
      imageUrl:"",

      DataForm: {},
      rules: {
        code: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        message: { required: true, message: "请输入项目信息", trigger: "blur" },
        lon: { required: true, message: "请输入坐标经度", trigger: "blur" },
        lat: { required: true, message: "请输入坐标纬度", trigger: "blur" },
      },
    };
  },
  mounted() {
    this.getList();
  },

  methods: {
    selectchange() {
      this.DataForm = {
        code: this.ruleForm.code,
        user: this.$store.getters.user.name,
      };

    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.user = this.$store.getters.user.name;
          this.$axios
            .post(`/proj/Plus`, this.ruleForm)
            .then((res) => {
            })
            .catch((err) => console.log(err));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    getList() {
      const { name } = this.$store.getters.user;
      const userdata = {
        name,
      };
      this.$axios
        .post("/proj/all", userdata)
        .then((res) => {
          const tableData = res.data;

          this.listObj = tableData;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //控制图片预览窗口的显示与隐藏
    beforeAvatarUpload(file) {
      this.DataForm = {
        code: this.ruleForm.code,
        user: this.$store.getters.user.name,
      };
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isJPG || isPNG)) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isPNG || isJPG) && isLt2M;
    },
    beforeFileUpload(file) {
      const isxlsx =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (!isxlsx) {
        this.$message.error("上传头像图片只能是 xlsx 格式!");
      }

      return isxlsx;
    },

    handleAvatarSuccess(res, file) {
      if (res.status == "1") return this.$message.error(res.message);
      this.imageUrl = res.imageUrl;
      this.$message.success("修改头像成功");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style land="less">
.DataImport {
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: aliceblue;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-icon-plus:before {
  content: "\e6d9";
  margin-top: 60px;
  display: block;
}
.el-upload-dragger .el-upload__text {
  height: 20px;
}
</style>
