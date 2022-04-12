<template>
  <section class="track">
    <el-form :inline="true" :model="formInline" class="searchbar">
      <!-- <el-form-item label="Data ID:" >
        <el-input  v-model="formInline.user" placeholder="版本ID"></el-input>
      </el-form-item> -->
       <el-form-item :label="$t('message.common.group')">
        <el-select v-model="formInline.group"  @change="getinstance()" placeholder="Please group" >
          <el-option label="ALL" value=""></el-option>
          <el-option
              v-for="item in groupData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.ci.env')">
        <el-select v-model="formInline.environment" @change="getinstance()" placeholder="Please environment" >
          <el-option label="ALL" value=""></el-option>
            <el-option
                    v-for="item in dictutil.getDictListByType('app_ns_type')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.scm.node')">
        <el-select v-model="formInline.instance" placeholder="Please node" >
          <el-option label="ALL" value=""></el-option>
            <el-option
            v-for="item in instanceFormData"
            :key="item.id"
            :label="item.host"
            :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>

      <!-- 选择日期 -->
      <!-- <div class="starttime">
        <span class="demonstration">始止日期:</span>
        <el-date-picker v-model="value1" type="date" placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="endtime">
        <span class="demonstration"></span>
        <el-date-picker
          v-model="value2"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div> -->

      <el-form-item>
        <el-button type="success" @click="onSubmit" :loading="loading">{{$t('message.common.search')}}</el-button>
      </el-form-item>
    </el-form>

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
            prop="historyId"
            label="Release ID"
               min-width="60">
          </el-table-column>
          <el-table-column
            prop="id"
            label="Version ID"
               min-width="60">
          </el-table-column>
          <el-table-column
            prop="groupName"
            :label="$t('message.common.group')"
               min-width="50">
          </el-table-column>
          <el-table-column
            prop="envRemark"
            :label="$t('message.ci.env')"
              min-width="70">
          </el-table-column>
          <el-table-column
            prop="host"
            :label="$t('message.iam.host')"
              >
          </el-table-column>

          <el-table-column
            prop="type"
            :label="$t('message.common.type')"
            :filters="[{ text: '发布', value: '1' }, { text: '回滚', value: '2' }]"
            :filter-method="filterTag"
            filter-placement="bottom-end" min-width="50">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.type === '发布' ? 'primary' : 'success'"
                disable-transitions>{{scope.row.type==1?'发布':'回滚'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            :label="$t('message.common.remark')">
             <template slot-scope="scope">
                 <el-input  v-model="scope.row.remark" ></el-input>
              </template>
          </el-table-column>
          <el-table-column
            prop="createDate"
            :label="$t('message.common.createDate')"
               min-width="90">
          </el-table-column>
           <el-table-column :label="$t('message.common.operation')" width="156">
            <template slot-scope="scope">
                <el-button @click="rollback(scope.row)" type="danger" >{{$t('message.common.rollback')}}</el-button>
                <el-button @click="details(scope.row)" type="info" >{{$t('message.common.detail')}}</el-button>
                <!-- <el-button type="text" @click="updateVersion(scope.row)" size="small">保存</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button> -->
              </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
      <el-dialog
            :title="logtitle"
            :visible.sync="dialogDisable"
            width="80%"
            custom-class="mytc"
            >
            <div v-loading='dialogLoading'>
              <div class="mysss"><p>版本号: {{ detail.releaseId }}</p></div>
              <div class="mysss"><p>发布结果状态:
                <el-tag
                :type="detail.status == '1' ? 'success' : detail.status == '-1'? 'info':'danger'"
                disable-transitions>{{detail.status == '1' ? '成功' : detail.status == '-1'? '未更改':'更新失败'}}</el-tag></p></div>
              <div class="mysss"><p>描述: {{ detail.description }}</p></div>
              <div class="mysss"><p>返回结果: </p></div>
              <el-input type="textarea" autosize v-model="detail.result" :disabled="false"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogDisable = false">OK</el-button>
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
  import Track from './Track.js'

  export default Track
</script>
<style scoped>
  .number{
    font-weight: bold;color: #6cb33e;
  }
  .starttime,.endtime{
    display: inline-block;
  }
  .mytc .el-dialog__body {
    padding: 10px 10px;
    color: #48576a;
    font-size: 12px;
  }
  .mysss {
    padding: 5px 5px;
  }

</style>
