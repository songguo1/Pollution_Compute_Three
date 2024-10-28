<template>
  <div>
    <el-dialog style="width: 1500px;" title="污染标准" :visible.sync="dialogTableVisible">
      <el-form
        :model="Form"
        ref="Form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="污染类型">
              <el-select v-model="Form.style" placeholder="请选择污染类型">
                <el-option label="土壤" value="soil"></el-option>
                <el-option label="水体" value="water"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="污染标准">
              <el-select
                style="width: 400px !important"
                v-model="Form.standard"
                placeholder="请选择污染标准"
              >
                <el-option
                  v-for="option in standardOptions"
                  :label="option.label"
                  :value="option.value"
                  :key="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="grade_radio">
        <div v-show="Form.standard === 'water_2'">
          <el-form-item label="级别">
            <el-radio-group v-model="Form.grade">
              <el-radio label="Ⅰ类"></el-radio>
              <el-radio label="Ⅱ类"></el-radio>
              <el-radio label="Ⅲ类"></el-radio>
              <el-radio label="Ⅳ类"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-show="Form.standard === 'soil_1'">
          <el-form-item label="级别">
            <el-radio-group v-model="Form.grade">
              <el-radio label="筛选值（第一类用地）"></el-radio>
              <el-radio label="筛选值（第二类用地）"></el-radio>
              <el-radio label="管制值（第一类用地）"></el-radio>
              <el-radio label="管制值（第二类用地）"></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-show="Form.standard === 'soil_2'">
          <el-form-item label="类型">
            <el-radio-group v-model="Form.grade">
              <el-radio label="水田"></el-radio>
              <el-radio label="果园"></el-radio>
              <el-radio label="其他"></el-radio>

            </el-radio-group>
          </el-form-item>
        </div>
      </div>
        <el-divider></el-divider>
        <el-table
          border
          :data="currentStandardData"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        >


            <el-table-column  fixed="left" property="plus" ></el-table-column>
          <el-table-column property="PH" label="pH值"></el-table-column>
          <el-table-column property="As" label="砷"></el-table-column>
          <el-table-column property="Cd" label="镉"></el-table-column>
          <el-table-column property="Cu" label="铜"></el-table-column>
          <el-table-column property="Pb" label="铅"></el-table-column>
          <el-table-column property="Hg" label="汞"></el-table-column>
          <el-table-column property="Ni" label="镍"></el-table-column>
          <el-table-column property="Cr" label="六价铬"></el-table-column>
        </el-table>

        <el-form-item class="standard_item">
          <el-button
            class="standard_button"
            type="primary"
            @click="submitForm"
            >确定</el-button
          >
          <el-button class="standard_button" @click="exitForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getTableByType, getStandardsByType } from "./js/StandardsModule";
export default {
  data() {
    return {
      Form: {
        style: "soil",
        standard: "",
        grade: "Ⅰ类",
      },

      dialogTableVisible: false,
    };
  },
  methods: {
    showDialog() {
      this.dialogTableVisible = true;
    },
    exitForm() {
      this.dialogTableVisible = false;
    },
    submitForm(){
      this.$emit('submit_data',this.currentStandardData)
      this.dialogTableVisible = false;
    }
  },

  computed: {
    //确定污染标准后，获取表格内容
    currentStandardData() {
      return getTableByType(this.Form.standard, this.Form.grade);
    },

    //在类型确定后，将污染标准选择器内的内容清空，返回标准选择器的内容
    standardOptions() {
      this.Form.standard = "";
      this.Form.grade = "";
      return getStandardsByType(this.Form.style);
    },
  },
};
</script>

<style land="less">
.standard_item {
  margin-top: 10px;

  .el-form-item__content {
    margin-left: 10px !important;
  }
  .standard_button {
    padding: 12px 50px !important;
  }
}
.demo-ruleForm {
  .el-divider {
    margin: 0px !important;
  }
  .el-form-item .el-form-item__label {
    font-weight: bold;

    font-size: medium;
  }

}
.grade_radio{
  .el-form-item__label {
    width: 70px !important;
  }
  .el-radio{
    margin-right: 100px;
    height:30px
  }
}
</style>
