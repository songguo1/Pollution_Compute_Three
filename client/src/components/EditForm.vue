<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="项目编号">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="项目地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目类型">
          <el-select v-model="form.type" placeholder="项目类型">
            <el-option label="土壤" value="土壤"></el-option>
            <el-option label="水体" value="水体"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="活动时间">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.date"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="负责人">
          <el-input v-model="form.manager"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="项目进展">
      <el-radio-group v-model="form.progress">
        <el-radio label="进行中"></el-radio>
        <el-radio label="已完成"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="坐标经度">
          <el-input v-model="form.lon"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="坐标纬度">
          <el-input v-model="form.lat"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="上传照片">
      <el-upload
        class="avatar-uploader"
        name="image"
        action="http://127.0.0.1:3000/api/image/upload"
        :show-file-list="false"
        :headers="headerObj"
        :before-upload="beforeAvatarUpload"
        :data="DataForm"
        :on-success="handleAvatarSuccess"
        :on-preview="handlePictureCardPreview"
      >
        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    form: Object,
  },
  data() {
    return {
      headerObj: {
        Authorization: localStorage.getItem("mytoken"),
      },

      DataForm: {},
    };
  },
  mounted() {
    this.initDataForm();
  },
  methods: {
    //初始化DataForm
    initDataForm() {
      this.DataForm = {
        code: this.form.code,
        user: this.$store.getters.user.name,
      };
    },
    //控制图片预览窗口的显示与隐藏
    beforeAvatarUpload(file) {

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
    handleAvatarSuccess(res, file) {
      if (res.status == "1") return this.$message.error(res.message);
      this.form.imageUrl = res.imageUrl;
      // this.$message.success("修改头像成功");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style land="less">
.el-dialog__header {
  background-color: rgb(89, 148, 199);
}
.el-dialog__headerbtn .el-dialog__close {
  color: azure;
}
.el-dialog__title {
  color: azure;
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

  display: block;
}
</style>
