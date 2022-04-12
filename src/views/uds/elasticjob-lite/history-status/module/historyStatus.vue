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
    <div class="btn-group" style="">
      <el-autocomplete
        :placeholder="$t('elasticjob.historyStatus.searchForm.jobName')"
        :fetch-suggestions="fetchJobNameSuggestions"
        v-model="searchForm.jobName"
        clearable>
      </el-autocomplete>
      <el-date-picker
        v-model="creationTimeRange"
        :placeholder="$t('elasticjob.historyStatus.searchForm.creationTimeRange')"
        :start-placeholder="$t('elasticjob.historyStatus.searchForm.creationTimeFrom')"
        :end-placeholder="$t('elasticjob.historyStatus.searchForm.creationTimeTo')"
        type="datetimerange"
      >
      </el-date-picker>
      <el-select
        :placeholder="$t('elasticjob.historyStatus.searchForm.state')"
        v-model="searchForm.state"
        clearable>
        <el-option
          v-for="item in stateItems"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        icon="el-icon-search"
        @click="getJobStatus"
      ></el-button>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          v-for="(item, index) in column"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter = "item.formatter"
        />
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
  name: 'HistoryStatus',
  data() {
    return {
      column: [
        {
          label: this.$t('elasticjob.historyStatus').column.jobName,
          prop: 'jobName'
        },
        {
          label: this.$t('elasticjob.historyStatus').column.shardingItem,
          prop: 'shardingItems'
        },
        {
          label: this.$t('elasticjob.historyStatus').column.state,
          prop: 'state'
        },
        {
          label: this.$t('elasticjob.historyStatus').column.createTime,
          prop: 'creationTime',
          formatter: function(row, cell, value) {
            var t = new Date(value)
            if (!t) {
              return ''
            }
            return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
          }
        },
        {
          label: this.$t('elasticjob.historyStatus').column.remark,
          prop: 'message'
        }
      ],
      stateItems: [
        {
          value: 'TASK_STAGING',
          label: this.$t('elasticjob.historyStatus').searchForm.stateStaging
        }, {
          value: 'TASK_FAILED',
          label: this.$t('elasticjob.historyStatus').searchForm.stateFailed
        },
        {
          value: 'TASK_FINISHED',
          label: this.$t('elasticjob.historyStatus').searchForm.stateFinished
        }, {
          value: 'TASK_RUNNING',
          label: this.$t('elasticjob.historyStatus').searchForm.stateRunning
        },
        {
          value: 'TASK_ERROR',
          label: this.$t('elasticjob.historyStatus').searchForm.stateError
        }, {
          value: 'TASK_KILLED',
          label: this.$t('elasticjob.historyStatus').searchForm.stateKilled
        }
      ],
      searchForm: {
        jobName: '',
        state: '',
        creationTimeFrom: null,
        creationTimeTo: null
      },
      creationTimeRange: [],
      tableData: [],
      cloneTableData: [],
      currentPage: 1,
      pageSize: 10,
      total: null
    }
  },
  created() {
    this.getJobStatus()
  },
  methods: {
    ...mapActions(['setRegCenterActivated']),
    fetchJobNameSuggestions(jobNamePrefix, callback) {
      this.$$api_elasticjob_getStatusJobNameSuggestions({
        data: {jobNamePrefix: jobNamePrefix},
        fn: json => {
          let res = json.data
          const jobNames = res.model
          const suggestions = jobNames.map(jobName => ({ value: jobName }))
          callback(suggestions)
        }
      })
    },
    handleCurrentChange(val) {
      const page = {
        pageSize: this.pageSize,
        pageNumber: val
      }
      this.$$api_elasticjob_loadStatus({
        data: Object.assign(this.getSearchForm(), page),
        fn: json => {
          let res = json.data
          const data = res.model.rows
          this.total = res.model.total
          this.tableData = data
        }
      })
    },
    getJobStatus() {
      this.currentPage = 1
      this.total = 0
      this.$$api_elasticjob_loadStatus({
        data: this.getSearchForm(),
        fn: json => {
          let res = json.data
          const data = res.model.rows
          this.total = res.model.total
          this.tableData = data
        }
      })
    },
    getSearchForm() {
      const requestBody = clone(this.searchForm)
      requestBody.jobName = this.getNullIfEmpty(requestBody.jobName)
      requestBody.state = this.getNullIfEmpty(requestBody.state)
      if (this.creationTimeRange) {
        requestBody.creationTimeFrom = this.creationTimeRange[0]
        requestBody.creationTimeTo = this.creationTimeRange[1]
      }
      return requestBody
    },
    getNullIfEmpty(value) {
      return value === '' ? null : value
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
.el-input {
  width: 200px;
}
</style>
