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
        v-model="searchForm.serverIp"
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
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('elasticjob.operationServers.labelInfo.operate')"
          fixed="right"
          width="300">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                v-if="scope.row.instancesNum"
                size="mini"
                type="info"
                plain
                @click="handleDetail(scope.row)">{{ $t("elasticjob.operationServers.actionText.detail") }}</el-button>
              <el-button
                v-if="scope.row.instancesNum && scope.row.disabledJobsNum"
                :disabled="isGuest"
                size="mini"
                type="success"
                plain
                @click="handleEnable(scope.row)">{{ $t("elasticjob.operationServers.actionText.enable") }}</el-button>
              <el-button
                v-if="0===scope.row.disabledJobsNum && scope.row.instancesNum"
                :disabled="isGuest"
                size="mini"
                type="warning"
                plain
                @click="handleDisable(scope.row)">{{ $t("elasticjob.operationServers.actionText.disable") }}</el-button>
              <el-button
                v-if="scope.row.instancesNum"
                :disabled="isGuest"
                size="mini"
                type="danger"
                plain
                @click="handleShutdown(scope.row)">{{ $t("elasticjob.operationServers.actionText.shutdown") }}</el-button>
              <el-button
                v-if="0===scope.row.instancesNum"
                :disabled="isGuest"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain
                @click="handlerRemove(scope.row)">{{ $t("elasticjob.operationServers.actionText.remove") }}</el-button>
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
  </el-row>
</template>
<script>
import { mapActions } from 'vuex'
import clone from 'lodash/clone'
export default {
  name: 'OperationServers',
  data() {
    return {
      isGuest: window.localStorage.getItem('isGuest') === 'true',
      column: [
        {
          label: this.$t('elasticjob.operationServers').labelInfo.serverIp,
          prop: 'serverIp'
        },
        {
          label: this.$t('elasticjob.operationServers').labelInfo.instancesNum,
          prop: 'instancesNum'
        },
        {
          label: this.$t('elasticjob.operationServers').labelInfo.jobsNum,
          prop: 'jobsNum'
        },
        {
          label: this.$t('elasticjob.operationServers').labelInfo.disabledJobsNum,
          prop: 'disabledJobsNum'
        }
      ],
      searchForm: {
        serverIp: ''
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
    getAllServersBriefInfo() {
      var params = {
      }
      this.$$api_elasticjob_getAllServersBriefInfo({
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
      if (!this.searchForm.serverIp) {
        return true
      }
      if (!model) {
        return true
      }
      return model.serverIp && model.serverIp.toLowerCase().includes(this.searchForm.serverIp.toLowerCase())
    },
    handleDetail(row) {
      const params = {
        serverIp: row.serverIp
      }
      localStorage.setItem('/operation-servers/status-detail/serverIp', params.serverIp)
      this.$router.push({ path: '/operation-servers/status-detail', params: params })
    },
    handleEnable(row) {
      const params = {
        serverIp: row.serverIp
      }
      this.$$api_elasticjob_enableServer({
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
        serverIp: row.serverIp
      }
      this.$$api_elasticjob_disableServer({
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
      if (!confirm(this.$t('elasticjob.operationServers').actionConfirm.shutdown)) {
        return
      }
      const params = {
        serverIp: row.serverIp
      }
      this.$$api_elasticjob_shutdownServer({
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
        serverIp: row.serverIp
      }
      this.$$api_elasticjob_removeServer({
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
    search() {
      this.getAllServersBriefInfo()
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
