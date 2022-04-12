<template>
    <div>
        <div class="monacoDialog">
          <div style="width:49%;height:95%">
            <el-form ref="form" :inline="true" :model="formData" label-width="60px">
              <el-form-item label="数据源名">
                <el-input v-model="formData.dataName"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-input v-model="formData.type"></el-input>
              </el-form-item>
              <el-button type="success" @click="RunningResult" style="float:right">运行</el-button>
            </el-form>

          <MyEditor
          ref="monacoEditor"
          style="height:92%"
          :language="'sql'"
          :codes="sqlCodes"
          :showTheme="false"
          :runningButton="false"
          @onMounted="sqlOnMounted"
          @onCodeChange="sqlOnCodeChange"/>
          </div>
        <div style="width: 50%">
            <el-form ref="form" :inline="true" :model="searchData" label-width="60px">
                <el-form-item label="数据源名">
                  <el-input v-model="searchData.dataName"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                  <el-input v-model="searchData.type"></el-input>
                </el-form-item>
                <el-button type="success" @click="searchDataSourse" style="float:right">查询</el-button>
            </el-form>
          <template>
            <el-table :data="tableData" :border="true" align='center'>
              <el-table-column align="center" prop="dataName" label="数据源名 "></el-table-column>
              <el-table-column align="center" prop="type" label="类型"></el-table-column>
              <el-table-column align="center" prop="runStartTime" label="运行开始时间"></el-table-column>
              <el-table-column align="center" prop="runEndTime" label="运行结束时间"></el-table-column>
              <el-table-column align="center" prop="runningSQL" label="运行SQL">
                <template slot-scope="scope">
                    <el-button type="success" @click="showDetail(scope.row)">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="creater" label="创建人"></el-table-column>
              <el-table-column
                align="center"
                :label="$t('message.common.operation')"
                min-width="200"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-s-tools"
                    @click="clickRollBACK(scope.row)"
                  >执行回滚</el-button>
                  <el-button
                    type="text"
                    icon="el-icon-tickets"
                  >下载undosql</el-button>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    :title="$t('message.common.del')"
                    @click="deleteDataSourse(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
    </div>
</template>

<script>
import Maintenance from "./maintenance.js";
export default Maintenance;
</script>

<style>
.monacoDialog {
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: space-between;
}
</style>