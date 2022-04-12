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
    <div class="btn-group">
      <el-button
        :disabled="isGuest"
        class="btn-plus"
        type="primary"
        icon="el-icon-plus"
        @click="add"
      >{{ $t("elasticjob.registryCenter.btnTxt") }}</el-button>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          v-for="(item, index) in column"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column :label="$t('elasticjob.registryCenter.table.operate')" fixed="right" width="200">
          <template slot-scope="scope">
            <el-tooltip
              :content="!scope.row.activated ? $t('elasticjob.registryCenter.table.operateConnect'): $t('elasticjob.registryCenter.table.operateConnected')"
              class="item"
              effect="dark"
              placement="top"
            >
              <el-button
                :type="scope.row.activated ? 'success' : 'primary'"
                :disabled="isGuest"
                icon="el-icon-link"
                size="small"
                @click="handleConnect(scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              :content="$t('elasticjob.registryCenter.table.operateDel')"
              class="item"
              effect="dark"
              placement="top"
            >
              <el-button
                :disabled="isGuest"
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="handlerDel(scope.row)"
              />
            </el-tooltip>
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
      :title="$t('elasticjob.registryCenter.registDialog.title')"
      :visible.sync="addDialogVisible"
      width="1010px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="170px">
        <el-form-item :label="$t('elasticjob.registryCenter.registDialog.name')" prop="name">
          <el-input :placeholder="$t('elasticjob.registryCenter.rules.name')" v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.registryCenter.registDialog.address')" prop="zkAddressList">
          <el-input
            :placeholder="$t('elasticjob.registryCenter.rules.address')"
            v-model="form.zkAddressList"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.registryCenter.registDialog.namespaces')" prop="namespace">
          <el-input
            :placeholder="$t('elasticjob.registryCenter.rules.namespaces')"
            v-model="form.namespace"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.registryCenter.registDialog.digest')">
          <el-input
            :placeholder="$t('elasticjob.registryCenter.rules.digest')"
            v-model="form.digest"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t("elasticjob.registryCenter.registDialog.btnCancelTxt") }}</el-button>
        <el-button
          type="primary"
          @click="onConfirm('form')"
        >{{ $t("elasticjob.registryCenter.registDialog.btnConfirmTxt") }}</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import { mapActions } from 'vuex'
import clone from 'lodash/clone'
export default {
  name: 'RegistryCenter',
  data() {
    return {
      addDialogVisible: false,
      isGuest: window.localStorage.getItem('isGuest') === 'true',
      column: [
        {
          label: this.$t('elasticjob.registryCenter').registDialog.name,
          prop: 'name'
        },
        {
          label: this.$t('elasticjob.registryCenter').registDialog.address,
          prop: 'zkAddressList'
        },
        {
          label: this.$t('elasticjob.registryCenter').registDialog.namespaces,
          prop: 'namespace'
        }
      ],
      form: {
        name: '',
        zkAddressList: '',
        namespace: '',
        digest: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('elasticjob.registryCenter').rules.name,
            trigger: 'change'
          }
        ],
        zkAddressList: [
          {
            required: true,
            message: this.$t('elasticjob.registryCenter').rules.address,
            trigger: 'change'
          }
        ],
        namespace: [
          {
            required: true,
            message: this.$t('elasticjob.registryCenter').rules.namespaces,
            trigger: 'change'
          }
        ],
        instanceType: [
          {
            required: true,
            message: this.$t('elasticjob.registryCenter').rules.centerType,
            trigger: 'change'
          }
        ],
        orchestrationName: [
          {
            required: true,
            message: this.$t('elasticjob.registryCenter').rules.orchestrationName,
            trigger: 'change'
          }
        ]
      },
      tableData: [],
      cloneTableData: [],
      currentPage: 1,
      pageSize: 10,
      total: null
    }
  },
  created() {
    this.getRegCenter()
  },
  methods: {
    ...mapActions(['setRegCenterActivated']),
    handleCurrentChange(val) {
      const data = clone(this.cloneTableData)
      this.tableData = data.splice(val - 1, this.pageSize)
    },
    getRegCenter() {
      this.$$api_elasticjob_getRegCenter({
        data: {},
        fn: json => {
          let res = json.data
          const data = res.model
          this.total = data.length
          this.cloneTableData = clone(res.model)
          this.tableData = data.splice(0, this.pageSize)
        }
      })
      this.getRegCenterActivated()
    },
    getRegCenterActivated() {
      this.$$api_elasticjob_getRegCenterActivated({
        data: {},
        fn: json => {
          let res = json.data
          this.setRegCenterActivated(res.model.name)
        }
      })
    },
    handleConnect(row) {
      if (row.activated) {
        this.$notify({
          title: this.$t('elasticjob.common').notify.title,
          message: this.$t('elasticjob.common').connected,
          type: 'success'
        })
      } else {
        const params = {
          name: row.name
        }
        this.$$api_elasticjob_postRegCenterConnect({
          data: params,
          fn: json => {
            let res = json.data
            this.$notify({
              title: this.$t('elasticjob.common').notify.title,
              message: this.$t('elasticjob.common').notify.conSucMessage,
              type: 'success'
            })
            this.getRegCenter()
          }
        })
      }
    },
    handlerDel(row) {
      const params = {
        name: row.name
      }
      this.$$api_elasticjob_deleteRegCenter({
        data: params,
        fn: json => {
          let res = json.data
          this.$notify({
            title: this.$t('elasticjob.common').notify.title,
            message: this.$t('elasticjob.common').notify.delSucMessage,
            type: 'success'
          })
          this.getRegCenter()
        }
      })
    },
    onConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$$api_elasticjob_postRegCenter({
            data: this.form,
            fn: json => {
              let res = json.data
              this.addDialogVisible = false
              this.$notify({
                title: this.$t('elasticjob.common').notify.title,
                message: this.$t('elasticjob.common').notify.addSucMessage,
                type: 'success'
              })
              this.getRegCenter()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add() {
      this.addDialogVisible = true
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
</style>
