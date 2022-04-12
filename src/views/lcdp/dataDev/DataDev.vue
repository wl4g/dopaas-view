<template>
  <div>
    <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
        <el-form-item :label="$t('message.common.name')">
            <el-input v-model="searchParams.name" placeholder="e.g. localhost" style="width:165px"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
        </el-form-item>

        <el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >+ Add</el-button>
    </el-form>
    <!-- 查询结果数值 -->
    <div class="query">
      <div class="query-left">
        <div class="line"></div>
        Result Total： <span class="number">{{ total }}</span>
      </div>
    </div>
    <!-- 查询结果表格 -->
    <div>
      <template>
        <el-table :data="tableData" :border="false" style="width: 100%">
          <el-table-column
            :label="$t('message.common.selectAll')"
            type="selection"
          ></el-table-column>
          <el-table-column prop="name">
            <template slot="header" >
              <!-- <span>{{$t('message.common.name')}}</span> -->
              <span>数据源名称</span>
              <el-tooltip
                class="item"
                effect="dark"
                content="生成器数据源信息"
                placement="right"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <a style="cursor: pointer" @click="editData(scope.row)">{{
                scope.row.name
              }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="数据源类型"></el-table-column>
          <el-table-column prop="time" label="最后维护时间"></el-table-column>
          <el-table-column prop="people" label="最后维护人"></el-table-column>
          <el-table-column
            :label="$t('message.common.operation')"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-s-tools"
                @click="clickMainTain(scope.row)"
              >维护</el-button>
              <el-button
                type="text"
                icon="el-icon-tickets"
              >历史记录</el-button>
              <el-button
                type="text"
                icon="el-icon-edit"
              >编辑</el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                :title="$t('message.common.del')"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="currentChange"
    ></el-pagination>
    <!-- 维护弹框 -->
    <el-dialog :close-on-click-modal="true" :title="dialogTitle" :visible.sync="MainTainDialogVisible" @close='closeDialog'  v-loading='dialogLoading' width="95%" >
      <div class="monacoDialog">
        <MyEditor
          style="width:49%"
          :language="'sql'"
          :showTheme="true"
          :codes="sqlCodes"
          @onMounted="sqlOnMounted"
          @onCodeChange="sqlOnCodeChange" />
        <div style="width: 49%">
          <template>
            <el-table :data="tableData" :border="true" align='center'>
              <el-table-column align="center" prop="type" label="数据源名 "></el-table-column>
              <el-table-column align="center" prop="time" label="类型"></el-table-column>
              <el-table-column align="center" prop="people" label="运行开始时间"></el-table-column>
              <el-table-column align="center" prop="people" label="运行结束时间"></el-table-column>
              <el-table-column align="center" prop="people" label="运行SQL"></el-table-column>
              <el-table-column align="center" prop="people" label="创建人"></el-table-column>
              <el-table-column
                align="center"
                :label="$t('message.common.operation')"
                min-width="200"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-s-tools"
                    @click="clickMainTain(scope.row)"
                  >执行回滚</el-button>
                  <el-button
                    type="text"
                    icon="el-icon-tickets"
                  >下载undosql</el-button>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    :title="$t('message.common.del')"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import DataDev from "./DataDev.js";
export default DataDev;
</script>
<style scoped>
.monacoDialog {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>

