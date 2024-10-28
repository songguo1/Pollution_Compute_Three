<template>
  <div class="manage">
    <!-- //提交表单 -->
    <div class="submitDialog">
      <el-dialog title="新建项目" :visible.sync="isShow_add">
        <AddForm :form="operateForm"></AddForm>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow_add = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="submitDialog">
      <el-dialog title="修改信息" :visible.sync="isShow_edit">
        <EditForm :form="operateForm"></EditForm>

        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow_edit = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">提交</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 新增按钮 -->

    <div class="manage-header">
      <div>
        <el-page-header @back="goBack" style="margin-left: 10px">
        </el-page-header>
      </div>
      <el-button
        type="primary"
        @click="addUser"
        size="small"
        icon="el-icon-circle-plus-outline"
        >新增</el-button
      >
      <div class="searchBox">
        <!-- 搜索框 -->
        <el-input
          class="search"
          placeholder="请输入项目编号"
          v-model="searchContent"
        >
        </el-input>
        <el-button
          class="searchBtn"
          type="primary"
          size="small"
          @click="handleSearch"
          >搜索</el-button
        >
        <el-button
          class="resetBtn"
          type="primary"
          size="small"
          @click="resetHandle"
          >刷新</el-button
        >
      </div>
    </div>

    <div class="table_container">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="502"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column prop="code" align="center" label="编号" width="150">
        </el-table-column>

        <el-table-column
          prop="name"
          align="center"
          label="项目名称"
        ></el-table-column>

        <el-table-column
          prop="type"
          align="center"
          label="项目类型"
        ></el-table-column>

        <el-table-column
          prop="address"
          align="center"
          label="项目地址"
        ></el-table-column>
        <el-table-column prop="manager" align="center" label="负责人">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.manager }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          align="center"
          label="项目日期"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="progress"
          align="center"
          label="项目进展"
        ></el-table-column>
        <el-table-column
          prop="lon"
          align="center"
          label="坐标经度"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="lat"
          align="center"
          label="坐标纬度"
          width="100"
        ></el-table-column>

        <el-table-column
          prop="imageUrl"
          align="center"
          label="图片"
          width="100"
        >
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt="图片" width="50" height="50" />
          </template>
        </el-table-column>

        <el-table-column
          prop="operation"
          align="center"
          width="200"
          label="操作"
        >
          <!-- //删除按钮与删除按钮 -->
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit-outline"
              title="编辑"
              size="small"
              @click.stop="handleEdit(scope.$index, scope.row)"
            >
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete-solid"
              size="small"
              title="删除"
              @click.stop="handleDelete(scope.$index, scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-data-analysis"
              size="small"
              title="污染分析"
              @click.stop="handleSkip(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-container>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="paginations.page_index"
            :page-sizes="paginations.page_sizes"
            :page-size="paginations.page_size"
            :layout="paginations.layout"
            :total="paginations.total"
          >
          </el-pagination>
        </div>
      </el-container>
    </div>
  </div>
</template>

<script>
import AddForm from "../../components/AddForm.vue";
import EditForm from "../../components/EditForm.vue";

export default {
  name: "ProjectList",
  data() {
    return {
      operateType: "add",
      user: this.$store.getters.user.name,
      isShow_add: false, //提交表单是否显示
      isShow_edit: false, //提交表单是否显示
      selectedRow: null,
      tableData: [], // 存放当前页面表格数据

      allTableData: [], // 存放所有表格数据以及搜索后的数据
      filterTableData: [], // 存放所有表格数据供搜索

      config: {
        page: 1,
        total: 30,
      },

      //提交表单里的元素
      operateForm: {
        code: "",
        name: "",
        type: "",
        address: "",
        manager: "",
        date: "",
        progress: "",
        user: "",
        lon: "",
        lat: "",
        imageUrl: "",
      },

      // formLabel: [],

      searchFrom: {
        keyword: "",
      },
      paginations: {
        page_index: 1, // 当前页
        total: 0, // 总数
        page_size: 10, // 默认每页显示多少条
        page_sizes: [5, 10, 15, 20], // 选择每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper",
      },
      // 搜索框里面的内容
      searchContent: "",
    };
  },
  components: { AddForm, EditForm },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    confirmAdd() {
      this.$axios
        .post("/proj/add", this.operateForm)
        .then((res) => {
          this.isShow_add = false;
          this.getList();
        })
        .catch((err) => console.log(err));
    },
    confirmEdit() {
      this.$axios
        .post("/proj/edit", this.operateForm)
        .then((res) => {
          this.isShow_edit = false;
          this.getList();
        })
        .catch((err) => console.log(err));
    },

    handleSkip(index, row) {
      this.$router.push(`/pollutionanalysis/${row.code}/${row.name}`);
    },

    getList() {
      const { name } = this.$store.getters.user;
      const userdata = {
        name,
      };
      this.$axios
        .post("/proj/all", userdata)
        .then((res) => {
          this.tableData = res.data;

          this.allTableData = res.data;
          this.filterTableData = res.data;
          this.setPaginations();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addUser() {
      this.isShow_add = true;
      this.operateType = "add";
      this.operateForm = {
        code: "",
        name: "",
        type: "",
        address: "",
        manager: "",
        date: "",
        progress: "",
        user: this.user,
        lon: "",
        lat: "",
        imageUrl: "",
      };
    },

    handleEdit(index, row) {
      this.operateType = "edit";
      this.isShow_edit = true;

      this.operateForm = {
        code: row.code,
        name: row.name,
        type: row.type,
        address: row.address,
        manager: row.manager,
        date: row.date,
        progress: row.progress,
        user: this.user,
        lon: row.lon,
        lat: row.lat,
        imageUrl: row.imageUrl,
      };
    },

    handleDelete(index, row) {
      this.operateForm = {
        code: row.code,
        name: row.name,
        type: row.type,
        address: row.address,
        manager: row.manager,
        date: row.date,
        progress: row.progress,
        user: this.user,
      };
      this.$confirm("此操作将永久删除该项目，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.post(`/proj/delete`, this.operateForm).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 分页相关函数
    setPaginations() {
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.tableData = this.allTableData.filter(
        (item, index) => index < this.paginations.page_size
      );
      // console.log(this.allTableData[0])
    },
    handleSizeChange(page_size) {
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    // 页面跳转
    handleCurrentChange(page) {
      const index = this.paginations.page_size * (page - 1);
      const nums = this.paginations.page_size * page;
      const tables = [];
      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) tables.push(this.allTableData[i]);
      }
      this.tableData = tables;
    },

    // 内容搜索
    handleSearch() {
      if (!this.searchContent) {
        this.$message({ type: "warning", message: "请输入项目名称或项目编码" });
        this.getList();
        return;
      }

      this.allTableData = this.filterTableData.filter((item, index) => {
        return (
          this.searchContent === item.name || this.searchContent === item.code
        );
      });
      this.setPaginations();
    },
    //重置按钮
    resetHandle() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  // computed: {
  //     user(){
  //         return this.$store.getters.user
  //     }
  // }
};
</script>

<style lang="less">
.manage-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex; // 弹性部局
  justify-content: flex-start;
  align-items: center; // 居中
  margin-bottom: 10px;
  height: 60px;

  .searchBox {
    margin-left: 950px;
  }
  .el-button {
  }
}
.custom-table /deep/ .el-table__body tr:first-child td {
  background-color: #17aec5;
}
.search {
  // height: 32px;
  width: 200px;
  // float: right;
}
.searchBtn {
  margin-left: 10px;
}

.pagination {
  margin-left: auto;
  margin-top: 5px;
  margin-bottom: 5px;
}

.el-table__body tr:hover > td {
  color: black;
  background-color: rgb(119, 166, 213) !important;
  cursor: pointer;
}

.el-container {
  background-color: aliceblue;
}

//test-dialog是添加的类样式
.el-dialog {
  position: absolute;
  left: 400px;
  top: -80px;
}
</style>
