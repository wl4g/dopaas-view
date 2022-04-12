<!--
  - Licensed to the Apache Software Foundation (ASF) under one or more
  - contributor license agreements.  See the NOTICE file distributed with
  - this work for additional information regarding copyright ownership.
  - The ASF licenses this file to You under the Apache License, Version 2.0
  - (the "License"); you may not use this file except in compliance with
  - the License.  You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <el-row class="box-card">
    <div class="btn-group pull-right" style="float: right;">
      <el-input
        v-model="searchForm.jobName"
        placeholder="Search"
        clearable
        autocomplete="off"
        @clear="search"
        @change="search" >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"></el-button>
      </el-input>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%">
        <el-table-column
          v-for="(item, index) in column"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <span v-if="'status'!==item.prop">{{ scope.row[item.prop] }}</span>
            <el-button
              v-if="'status'===item.prop"
              :type="statusColor[scope.row[item.prop]]"
              size="mini"
              plain>
              {{ $t("elasticjob.operationJobs.statusText."+scope.row[item.prop]) }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('elasticjob.operationJobs.table.operate')"
          fixed="right"
          width="380">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                :disabled="isGuest"
                size="mini"
                type="primary"
                plain
                @click="handleModify(scope.row)">{{ $t("elasticjob.operationJobs.actionText.modify") }}</el-button>
              <el-button
                v-if="'CRASHED'!==scope.row.status"
                size="mini"
                type="info"
                plain
                @click="handleDetail(scope.row)">{{ $t("elasticjob.operationJobs.actionText.detail") }}</el-button>
              <el-button
                v-if="'OK'===scope.row.status"
                :disabled="isGuest"
                size="mini"
                type="success"
                plain
                @click="handleTrigger(scope.row)">{{ $t("elasticjob.operationJobs.actionText.trigger") }}</el-button>
              <el-button
                v-if="'DISABLED'===scope.row.status"
                :disabled="isGuest"
                size="mini"
                type="success"
                plain
                @click="handleEnable(scope.row)">{{ $t("elasticjob.operationJobs.actionText.enable") }}</el-button>
              <el-button
                v-if="'OK'===scope.row.status"
                :disabled="isGuest"
                size="mini"
                type="warning"
                plain
                @click="handleDisable(scope.row)">{{ $t("elasticjob.operationJobs.actionText.disable") }}</el-button>
              <el-button
                v-if="'CRASHED'!==scope.row.status"
                :disabled="isGuest"
                size="mini"
                type="danger"
                plain
                @click="handleShutdown(scope.row)">{{ $t("elasticjob.operationJobs.actionText.shutdown") }}</el-button>
              <el-button
                v-if="'CRASHED'===scope.row.status"
                :disabled="isGuest"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain
                @click="handlerRemove(scope.row)">{{ $t("elasticjob.operationJobs.actionText.remove") }}</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :total="total"
          :current-page="currentPage"
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      :title="$t('elasticjob.operationJobs.labelInfo.editTitle')"
      :visible.sync="modifyDialogVisible"
      width="1010px"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="40px">

        <el-form-item>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.jobName') }}
          </el-col>
          <el-col :span="7">
            <el-input
              :placeholder="$t('elasticjob.operationJobs.rules.jobName')"
              v-model="editForm.jobName"
              disabled
              autocomplete="off"
            />
          </el-col>
          <el-col :span="1">
            &nbsp;
          </el-col>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.cron') }}
          </el-col>
          <el-col :span="1">
            &nbsp;
          </el-col>
          <el-col :span="7">
            <el-input
              :placeholder="$t('elasticjob.operationJobs.rules.cron')"
              v-model="editForm.cron"
              autocomplete="off"
            />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.shardingTotalCount') }}
          </el-col>
          <el-col :span="8">
            <el-input-number
              :placeholder="$t('elasticjob.operationJobs.labelInfo.shardingTotalCount')"
              v-model="editForm.shardingTotalCount"
              autocomplete="off"
            />
          </el-col>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.jobParameter') }}
          </el-col>
          <el-col :span="8">
            <el-input
              :placeholder="$t('elasticjob.operationJobs.labelInfo.jobParameter')"
              v-model="editForm.jobParameter"
              autocomplete="off"
            />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.maxTimeDiffSeconds') }}
          </el-col>
          <el-col :span="8">
            <el-input-number
              :placeholder="$t('elasticjob.operationJobs.labelInfo.maxTimeDiffSeconds')"
              v-model="editForm.maxTimeDiffSeconds"
              autocomplete="off"
            />
          </el-col>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.monitorExecution') }}
          </el-col>
          <el-col :span="8">
            <el-checkbox v-model="editForm.monitorExecution">{{ $t('elasticjob.operationJobs.labelInfo.monitorExecution') }} </el-checkbox>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.failover') }}
          </el-col>
          <el-col :span="8">
            <el-checkbox v-model="editForm.failover">{{ $t('elasticjob.operationJobs.labelInfo.failover') }} </el-checkbox>
          </el-col>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.misfire') }}
          </el-col>
          <el-col :span="8">
            <el-checkbox v-model="editForm.misfire">{{ $t('elasticjob.operationJobs.labelInfo.misfire') }} </el-checkbox>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="6">
            {{ $t('elasticjob.operationJobs.labelInfo.shardingItemParameters') }}
          </el-col>
          <el-col :span="18">
            <el-input
              :placeholder="$t('elasticjob.operationJobs.labelInfo.shardingItemParameters')"
              v-model="editForm.shardingItemParameters"
              type="textarea"
              autocomplete="off"
            />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.jobShardingStrategyType') }}
          </el-col>
          <el-col :span="7">
            <el-input
              :placeholder="$t('elasticjob.operationJobs.labelInfo.jobShardingStrategyType')"
              v-model="editForm.jobShardingStrategyType"
              autocomplete="off"
            />
          </el-col>
          <el-col :span="1">
            &nbsp;
          </el-col>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.jobExecutorServiceHandlerType') }}
          </el-col>
          <el-col :span="8">
            <el-input
              :placeholder="$t('elasticjob.operationJobs.labelInfo.jobExecutorServiceHandlerType')"
              v-model="editForm.jobExecutorServiceHandlerType"
              autocomplete="off"
            />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.jobErrorHandlerType') }}
          </el-col>
          <el-col :span="7">
            <el-input
              :placeholder="$t('elasticjob.operationJobs.labelInfo.jobErrorHandlerType')"
              v-model="editForm.jobErrorHandlerType"
              autocomplete="off"
            />
          </el-col>
          <el-col :span="1">
            &nbsp;
          </el-col>
          <el-col :span="4">
            {{ $t('elasticjob.operationJobs.labelInfo.description') }}
          </el-col>
          <el-col :span="8">
            <el-input
              :placeholder="$t('elasticjob.operationJobs.rules.description')"
              v-model="editForm.description"
              type="textarea"
              autocomplete="off"
            />
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col>
            {{ $t('elasticjob.operationJobs.labelInfo.props') }}
          </el-col>
        </el-form-item>
        <el-form-item
          v-for="(prop, index) in editForm.propList"
          :key="index"
        >
          <el-col :span="10">
            <el-input v-model="prop.name" :placeholder="$t('elasticjob.operationJobs.labelInfo.prop.name')"></el-input>
          </el-col>
          <el-col :span="10">
            <el-input v-model="prop.value" :placeholder="$t('elasticjob.operationJobs.labelInfo.prop.name')"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button @click="removeProperty(prop)">{{ $t('elasticjob.btn.remove') }}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col>
            <el-button @click="addProperty">{{ $t('elasticjob.btn.add') }}</el-button>
          </el-col>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">{{ $t('elasticjob.btn.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="onEditConfirm('editForm')"
        >{{ $t('elasticjob.btn.confirm') }}</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import { mapActions } from 'vuex'
import clone from 'lodash/clone'

export default {
  name: 'OperationJobs',
  data() {
    return {
      modifyDialogVisible: false,
      isGuest: window.localStorage.getItem('isGuest') === 'true',
      column: [
        {
          label: this.$t('elasticjob.operationJobs').labelInfo.jobName,
          prop: 'jobName'
        },
        {
          label: this.$t('elasticjob.operationJobs').labelInfo.shardingTotalCount,
          prop: 'shardingTotalCount'
        },
        {
          label: this.$t('elasticjob.operationJobs').labelInfo.cron,
          prop: 'cron'
        },
        {
          label: this.$t('elasticjob.operationJobs').labelInfo.description,
          prop: 'description'
        },
        {
          label: this.$t('elasticjob.operationJobs').labelInfo.status,
          prop: 'status'
        }
      ],
      statusColor: {
        OK: 'success',
        DISABLED: 'warning',
        CRASHED: 'info',
        SHARDING_FLAG: 'primary'
      },
      searchForm: {
        jobName: ''
      },
      editForm: {
        jobName: '',
        propList: [],
        shardingTotalCount: 1,
        cron: '',
        description: '',
        jobParameter: '',
        maxTimeDiffSeconds: -1,
        reconcileIntervalMinutes: 0,
        monitorExecution: false,
        failover: false,
        misfire: false,
        shardingItemParameters: '',
        jobShardingStrategyType: '',
        jobExecutorServiceHandlerType: '',
        jobErrorHandlerType: ''
      },
      rules: {
        jobName: [
          {
            required: true,
            message: this.$t('elasticjob.operationJobs').rules.jobName,
            trigger: 'change'
          }
        ],
        shardingTotalCount: [
          {
            required: true,
            message: this.$t('elasticjob.operationJobs').rules.shardingTotalCount,
            trigger: 'change'
          }
        ],
        cron: [
          {
            required: true,
            message: this.$t('elasticjob.operationJobs').rules.cron,
            trigger: 'change'
          }
        ],
        description: [
          {
            required: true,
            message: this.$t('elasticjob.operationJobs').rules.description,
            trigger: 'change'
          }
        ]
      },
      tableData: [],
      cloneTableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.search()
  },
  methods: {
    ...mapActions(['setRegCenterActivated']),
    handleCurrentChange(val) {
      const data = clone(this.cloneTableData)
      this.currentPage = val
      this.tableData = data.splice(this.pageSize * (val - 1), this.pageSize)
    },
    getAllJobsBriefInfo() {
      var params = {
      }
      this.$$api_elasticjob_getAllJobsBriefInfo({
        data: params,
        fn: json => {
          let res = json.data
          const data = Array.prototype.filter.call(res.model, this.filterSearchData)
          this.total = data.length
          this.cloneTableData = clone(data)
          this.tableData = data.splice(this.pageSize * (this.currentPage - 1), this.pageSize)
        }
      })
    },
    filterSearchData(model) {
      if (!this.searchForm.jobName) {
        return true
      }
      if (!model) {
        return true
      }
      return model.jobName && model.jobName.toLowerCase().includes(this.searchForm.jobName.toLowerCase())
    },
    addProperty() {
      this.editForm.propList.push({ name: '', value: '' })
    },
    removeProperty(prop) {
      const index = this.editForm.propList.indexOf(prop)
      if (index !== -1) {
        this.editForm.propList.splice(index, 1)
      }
    },
    handleModify(row) {
      const params = {
        jobName: row.jobName
      }
      this.$$api_elasticjob_getJobConfig({
        data: params,
        fn: json => {
          let res = json.data
          const data = res.model
          data.props = data.props || {}
          data.propList = data.propList || []
          for (const key in data.props) {
            data.propList.push({ name: key, value: data.props[key] })
          }
          this.editForm = data
          this.modifyDialogVisible = true
        }
      })
    },
    handleDetail(row) {
      const params = {
        jobName: row.jobName
      }
      localStorage.setItem('/operation-jobs/status-detail/jobName', params.jobName)
      this.$router.push({ path: '/operation-jobs/status-detail', params: params })
    },
    handleTrigger(row) {
      const params = {
        jobName: row.jobName
      }
      this.$$api_elasticjob_triggerJob({
        data: params,
        fn: json => {
          let res = json.data
          this.$notify({
            title: this.$t('elasticjob.common').notify.title,
            message: this.$t('elasticjob.common').notify.actionSucMessage,
            type: 'success'
          })
          this.search()
        }
      })
    },
    handleEnable(row) {
      const params = {
        jobName: row.jobName
      }
      this.$$api_elasticjob_enableJob({
        data: params,
        fn: json => {
          let res = json.data
          this.$notify({
            title: this.$t('elasticjob.common').notify.title,
            message: this.$t('elasticjob.common').notify.actionSucMessage,
            type: 'success'
          })
          this.search()
        }
      })
    },
    handleDisable(row) {
      const params = {
        jobName: row.jobName
      }
      this.$$api_elasticjob_disableJob({
        data: params,
        fn: json => {
          let res = json.data
          this.$notify({
            title: this.$t('elasticjob.common').notify.title,
            message: this.$t('elasticjob.common').notify.actionSucMessage,
            type: 'success'
          })
          this.search()
        }
      })
    },
    handleShutdown(row) {
      if (!confirm(this.$t('elasticjob.operationJobs').actionConfirm.shutdown)) {
        return
      }
      const params = {
        jobName: row.jobName
      }
      this.$$api_elasticjob_shutdownJob({
        data: params,
        fn: json => {
          let res = json.data
          this.$notify({
            title: this.$t('elasticjob.common').notify.title,
            message: this.$t('elasticjob.common').notify.actionSucMessage,
            type: 'success'
          })
          this.search()
        }
      })
    },
    handlerRemove(row) {
      const params = {
        jobName: row.jobName
      }
      this.$$api_elasticjob_removeJob({
        data: params,
        fn: json => {
          let res = json.data
          this.$notify({
            title: this.$t('elasticjob.common').notify.title,
            message: this.$t('elasticjob.common').notify.delSucMessage,
            type: 'success'
          })
          this.search()
        }
      })
    },
    onEditConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = clone(this.editForm)
          data.props = {}
          data.propList = data.propList || []
          for (const prop of data.propList) {
            data.props[prop.name] = prop.value
          }
          delete data.propList
          this.$$api_elasticjob_updateJobConfig({
            data: data,
            fn: json => {
              let res = json.data
              this.modifyDialogVisible = false
              this.$notify({
                title: this.$t('elasticjob.common').notify.title,
                message: this.$t('elasticjob.common').notify.addSucMessage,
                type: 'success'
              })
              this.search()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    search() {
      this.getAllJobsBriefInfo()
    }
  }
}
</script>
<style lang='scss' scoped>
.btn-group {
  margin-bottom: 20px;
}
.pagination {
  float: right;
  margin: 10px -10px 10px 0;
}
.el-form .el-col{
  padding-left: 4px;
}
</style>
