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
        <el-table-column :label="$t('elasticjob.appConfig.table.operate')" fixed="right" width="300">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                :disabled="isGuest"
                size="mini"
                type="primary"
                plain
                @click="handleDetail(scope.row)">{{ $t("elasticjob.appConfig.table.operateDetail") }}</el-button>
              <el-button
                :disabled="isGuest"
                size="mini"
                type="primary"
                plain
                @click="handleModify(scope.row)">{{ $t("elasticjob.appConfig.table.operateModify") }}</el-button>
              <el-button
                :disabled="isGuest"
                size="mini"
                type="primary"
                plain
                @click="handleDelete(scope.row)">{{ $t("elasticjob.appConfig.table.operateDel") }}</el-button>
              <el-button
                :disabled="isGuest"
                size="mini"
                type="primary"
                plain
                @click="handleDisable(scope.row)">{{ scope.row.disabled ? $t("elasticjob.appConfig.table.operateEnable") : $t("elasticjob.appConfig.table.operateDisable") }}</el-button>
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
      :title="$t('elasticjob.appConfig.addDialog.title')"
      :visible.sync="addDialogVisible"
      width="1010px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="210px">
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.appName')" prop="appName">
          <el-input :placeholder="$t('elasticjob.appConfig.rules.appName')" v-model="form.appName" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.script')" prop="bootstrapScript">
          <el-input
            :placeholder="'bin/start.sh'"
            v-model="form.bootstrapScript"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.cpu')" prop="cpuCount">
          <el-input
            :placeholder="$t('elasticjob.appConfig.rules.cpuCount')"
            v-model="form.cpuCount"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.memory')" prop="memoryMB">
          <el-input
            :placeholder="$t('elasticjob.appConfig.rules.memoryMB')"
            v-model="form.memoryMB"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.sampling')" prop="eventTraceSamplingCount">
          <el-input
            :placeholder="$t('elasticjob.appConfig.rules.eventTraceSamplingCount')"
            v-model="form.eventTraceSamplingCount"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.appURL')" prop="appURL">
          <el-input
            :placeholder="$t('elasticjob.appConfig.rules.appURL')"
            v-model="form.appURL"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.cacheEnable')" prop="cacheEnable">
          <el-checkbox v-model="form.appCacheEnable"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t("elasticjob.btn.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="onConfirm('form')"
        >{{ $t("elasticjob.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="isEdit ? $t('elasticjob.appConfig.dialog.editTitle') : $t('elasticjob.appConfig.dialog.detailTitle')"
      :visible.sync="editDialogVisible"
      width="1010px"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="210px">
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.appName')" prop="appName">
          <el-input :placeholder="$t('elasticjob.appConfig.rules.appName')" v-model="editForm.appName" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.script')" prop="bootstrapScript">
          <el-input
            :placeholder="'bin/start.sh'"
            v-model="editForm.bootstrapScript"
            autocomplete="off"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.cpu')" prop="cpuCount">
          <el-input
            :placeholder="$t('elasticjob.appConfig.rules.cpuCount')"
            v-model="editForm.cpuCount"
            autocomplete="off"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.memory')" prop="memoryMB">
          <el-input
            :placeholder="$t('elasticjob.appConfig.rules.memoryMB')"
            v-model="editForm.memoryMB"
            autocomplete="off"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.sampling')" prop="eventTraceSamplingCount">
          <el-input
            :placeholder="$t('elasticjob.appConfig.rules.eventTraceSamplingCount')"
            v-model="editForm.eventTraceSamplingCount"
            :disabled="!isEdit"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.appURL')" prop="appURL">
          <el-input
            :placeholder="$t('elasticjob.appConfig.rules.appURL')"
            v-model="editForm.appURL"
            autocomplete="off"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('elasticjob.appConfig.addDialog.cacheEnable')" prop="cacheEnable">
          <el-checkbox v-model="editForm.appCacheEnable" :disabled="!isEdit"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{ $t("elasticjob.btn.cancel") }}</el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          @click="edit('editForm')"
        >{{ $t("elasticjob.btn.submit") }}</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
// import { mapActions } from 'vuex'
import clone from 'lodash/clone'
import i18n from '../../../../../i18n/i18n'
export default {
  name: 'AppConfig',
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      isEdit: false,
      isGuest: window.localStorage.getItem('isGuest') === 'true',
      column: [
        {
          label: i18n.t('elasticjob.appConfig.table.appName'),
          prop: 'appName'
        },
        {
          label: i18n.t('elasticjob.appConfig.table.appUrl'),
          prop: 'appURL'
        },
        {
          label: i18n.t('elasticjob.appConfig.table.script'),
          prop: 'bootstrapScript'
        }
      ],
      form: {
        appName: '',
        appURL: '',
        bootstrapScript: '',
        cpuCount: '1',
        memoryMB: '128',
        eventTraceSamplingCount: '0',
        appCacheEnable: true
      },
      editForm: {},
      rules: {
        appName: [
          {
            required: true,
            message: i18n.t('elasticjob.appConfig.rules.appName'),
            trigger: 'change'
          }
        ],
        bootstrapScript: [
          {
            required: true,
            message: i18n.t('elasticjob.appConfig.rules.bootstrapScript'),
            trigger: 'change'
          }
        ],
        cpuCount: [
          {
            required: true,
            message: i18n.t('elasticjob.appConfig.rules.cpuCount'),
            trigger: 'change'
          }
        ],
        memoryMB: [
          {
            required: true,
            message: i18n.t('elasticjob.appConfig.rules.memoryMB'),
            trigger: 'change'
          }
        ],
        eventTraceSamplingCount: [
          {
            required: true,
            message: i18n.t('elasticjob.appConfig.rules.eventTraceSamplingCount'),
            trigger: 'change'
          }
        ],
        appURL: [
          {
            required: true,
            message: i18n.t('elasticjob.appConfig.rules.appURL'),
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
    this.getApp()
  },
  methods: {
    // ...mapActions(['setRegCenterActivated']),
    handleCurrentChange(val) {
      const data = clone(this.cloneTableData)
      this.tableData = data.splice(val - 1, this.pageSize)
    },
    getApp() {
      this.$$api_uds_getApp({
        data: {},
        fn: json => {
          const data = json.model
          this.total = data.length
          this.cloneTableData = clone(res.model)
          this.tableData = data.splice(0, this.pageSize)
        }
      })

    },
    handleConnect(row) {
      if (row.activated) {
        this.$notify({
          title: i18n.t('elasticjob.common.notify.title'),
          message: i18n.t('elasticjob.common.connected'),
          type: 'success'
        })
      } else {
        const params = {
          name: row.name
        }
        this.$$api_uds_postRegCenterConnect({
          data: params,
          fn: json => {
            this.$notify({
              title: i18n.t('elasticjob.common.notify.title'),
              message: i18n.t('elasticjob.common.notify.conSucMessage'),
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
      this.$$api_uds_deleteRegCenter({
        data: params,
        fn: json => {
          this.$notify({
            title: i18n.t('elasticjob.common.notify.title'),
            message: i18n.t('elasticjob.common.notify.delSucMessage'),
            type: 'success'
          })
          this.getRegCenter()
        }
      })
    },
    onConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$$api_uds_addApp({
            data: this.form,
            fn: json => {
              this.addDialogVisible = false
              this.$notify({
                title: i18n.t('elasticjob.common.notify.title'),
                message: i18n.t('elasticjob.common.notify.addSucMessage'),
                type: 'success'
              })
              this.getApp()
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
    },
    handleDetail(row) {
      this.isEdit = false
      this.editForm = row
      this.editDialogVisible = true
    },
    handleModify(row) {
      this.isEdit = true
      this.editForm = row
      this.editDialogVisible = true
    },
    edit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$$api_uds_updateApp({
            data: this.editForm,
            fn: json => {
              this.editDialogVisible = false
              this.$notify({
                title: i18n.t('elasticjob.common.notify.title'),
                message: i18n.t('elasticjob.common.notify.editSucMessage'),
                type: 'success'
              })
              this.getApp()
            }
          })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDelete(row) {
      this.$$api_uds_deleteApp({
        data: { 'appName': row.appName },
        fn: json => {
          this.$notify({
            title: i18n.t('elasticjob.common.notify.title'),
            message: i18n.t('elasticjob.common.notify.delSucMessage'),
            type: 'success'
          })
          this.getApp()
        }
      })
    },
    handleDisable(row) {
      if (row.disabled) {
        this.$$api_uds_enableApp({
          data: { 'appName': row.appName },
          fn: json => {
            this.$notify({
              title: i18n.t('elasticjob.common.notify.title'),
              message: i18n.t('elasticjob.appConfig.tips.enableSuccess'),
              type: 'success'
            })
            this.getApp()
          }
        })

      } else {
        this.$$api_uds_disableApp({
          data: { 'appName': row.appName },
          fn: json => {
            this.$notify({
              title: i18n.t('elasticjob.common.notify.title'),
              message: i18n.t('elasticjob.appConfig.tips.disableSuccess'),
              type: 'success'
            })
            this.getApp()
          }
        })

      }
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
