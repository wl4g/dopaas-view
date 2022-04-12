<template>
  <section class="historic">

    <!-- 筛选条件 -->
    <el-form :inline="true" :model="formInline" class="searchbar">
      <!-- 选择日期 -->
      <div class="starttime">
        <span class="demonstration">{{$t('message.common.createDate')}}</span>
        <el-date-picker v-model="value1" type="date" placeholder="Start Date" format="yyyy - MM - dd " >
        </el-date-picker>
      </div>
      <div class="endtime">
        <span class="demonstration"></span>
        <el-date-picker
          v-model="value2"
          type="date"
          placeholder="End Date" format="yyyy - MM - dd" >
        </el-date-picker>
      </div>
      <el-form-item>
        <el-button type="success" @click="onSubmit" :loading="loading">{{$t('message.common.search')}}</el-button>
      </el-form-item>
      <!-- 查询结果数值 -->
      <div class="query">
        <div class="query-left">
          <div class="line"></div>
          Result Total： <span class="number">{{total}}</span>
        </div>
      </div>

      <!-- 查询结果表格 -->
      <div>
        <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%">

            <el-table-column
              prop="id"
              label="Version Id"
              min-width="50"
                >
            </el-table-column>

             <el-table-column
              prop="sign"
              :label="$t('message.scm.signature')"
                >
            </el-table-column>
             <el-table-column
              prop="signtype"
              :label="$t('message.scm.algorithm')"
                >
            </el-table-column>

            <!-- 插入标签“是否是缺陷” -->
             <el-table-column
              :label="$t('message.scm.tag')" prop="tag">
              <template slot-scope="scope">
                <el-select v-model="tableData[scope.$index].tag"  clearable placeholder="该版本是否正常" class="choice" min-width="120">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

             <el-table-column
              prop="remark"
              :label="$t('message.common.remark')"
                >
            </el-table-column>

            <el-table-column
               :label="$t('message.common.operation')"
               width="220"
              >
              <template slot-scope="scope">
                <el-button @click="details(scope.row)" type="info" >{{$t('message.common.detail')}}</el-button>
                <el-button type="success" @click="updateVersion(scope.row)">{{$t('message.common.save')}}</el-button>
                <el-button type="danger"@click="handleDelete(scope.row)">{{$t('message.common.del')}}</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="createDate"
              label="Release Date"
                >
            </el-table-column>

          </el-table>
        </template>
      </div>

    </el-form>
    <!-- 弹出内容 -->
         <el-dialog
            :title="logtitle"
            :visible.sync="dialogDisable"
            width="80%"
            custom-class="tanchuang"
            >
            <el-radio-group v-model="propertiesid" @change="selectproperties()" >
              <el-radio-button  v-for="item in propertiesData"
                :label="item.id" :key="item.id" >{{item.filename}}</el-radio-button>
            </el-radio-group>
            <el-input type="textarea" autosize v-model="content" :disabled="false"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitflsh()">{{$t('message.common.refresh')}}</el-button>
          </span>
        </el-dialog>
    <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change='currentChange'
          >
  </el-pagination>
  </section>
</template>
<script>
  import Historic from './Historic.js'

  export default Historic
</script>
<style scoped>
  .starttime,.endtime{
    display: inline-block;
  }
  .number{
    font-weight: bold;color: #6cb33e;
  }

  /* 动态标签样式 */

</style>
