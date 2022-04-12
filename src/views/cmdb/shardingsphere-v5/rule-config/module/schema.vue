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
  <div class="schema">
    <el-row :gutter="10">
      <el-col
        v-for="(item, index) in schemaData"
        :key="index"
        :xs="24"
        :sm="12"
        :md="6"
        :lg="4"
        :xl="3"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.title }}</span>
            <i v-if="schemaData.length > 1" class="el-icon-delete" @click="handleDelete(item.title)"/>
          </div>
          <div v-for="(itm, idex) in item.children" :key="idex" class="coll-item">
            <div :class="'itm icon-' + idex" />
            <div class="txt">{{ itm }}</div>
            <i class="icon-edit" @click="handlerClick(item.title, itm)" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="add" />
    </el-row>
    <el-dialog :visible.sync="showMetadataDialogVisible" :title="type" width="60%" top="3vh">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input
            :rows="20"
            :placeholder="$t('shardingsphere.ruleConfig.form.inputPlaceholder')"
            v-model="textarea"
            type="textarea"
            readonly
            class="show-text"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMetadataDialogVisible = false">{{ $t('shardingsphere.btn.cancel') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="centerDialogVisible" :title="type" width="60%" top="3vh">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input
            :rows="20"
            :placeholder="$t('shardingsphere.ruleConfig.form.inputPlaceholder')"
            v-model="textarea"
            type="textarea"
            class="edit-text"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{ $t('shardingsphere.btn.cancel') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ $t('shardingsphere.btn.submit') }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addSchemaDialogVisible"
      :title="$t('shardingsphere.ruleConfig.schema.title')"
      width="80%"
      top="3vh">
      <el-form ref="form" :model="form" :rules="rules" label-width="170px">
        <el-form-item :label="$t('shardingsphere.ruleConfig.schema.name')" prop="name">
          <el-input
            :placeholder="$t('shardingsphere.ruleConfig.schemaRules.name')"
            v-model="form.name"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :label="$t('shardingsphere.ruleConfig.schema.ruleConfig')" prop="ruleConfig">
          <el-input
            :placeholder="$t('shardingsphere.ruleConfig.schemaRules.ruleConfig')"
            :rows="8"
            v-model="form.ruleConfig"
            autocomplete="off"
            type="textarea"
            class="edit-text"
          />
        </el-form-item>
        <el-form-item :label="$t('shardingsphere.ruleConfig.schema.dataSourceConfig')" prop="dataSourceConfig">
          <el-input
            :placeholder="$t('shardingsphere.ruleConfig.schemaRules.dataSourceConfig')"
            :rows="8"
            v-model="form.dataSourceConfig"
            autocomplete="off"
            type="textarea"
            class="edit-text"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSchemaDialogVisible = false">{{ $t('shardingsphere.btn.cancel') }}</el-button>
        <el-button type="primary" @click="addSchema('form')">{{ $t('shardingsphere.btn.submit') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="deleteDialogVisible"
      :title="$t('shardingsphere.common.notify.title')"
      width="30%">
      <span>{{ $t('shardingsphere.common.notify.confirmDelOperator') }} {{ schemaName }} ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('shardingsphere.btn.cancel') }}</el-button>
        <el-button type="primary" @click="deleteSchema()">{{ $t('shardingsphere.btn.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import yaml from 'js-yaml'

export default {
  name: 'Schema',
  data() {
    return {
      treeData: [],
      textarea: ``,
      schemaData: [],
      centerDialogVisible: false,
      type: null,
      sname: '',
      scname: '',
      addSchemaDialogVisible: false,
      deleteDialogVisible: false,
      schemaName: ``,
      rueleConfigTextArea: ``,
      dataSourceConfigTextArea: ``,
      metadataConfigTextArea: ``,
      showMetadataDialogVisible: false,
      form: {
        name: '',
        ruleConfig: '',
        dataSourceConfig: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('shardingsphere.ruleConfig').schemaRules.name,
            trigger: 'change'
          }
        ],
        ruleConfig: [
          {
            required: true,
            message: this.$t('shardingsphere.ruleConfig').schemaRules.ruleConfig,
            trigger: 'change'
          }
        ],
        dataSourceConfig: [
          {
            required: true,
            message: this.$t('shardingsphere.ruleConfig').schemaRules.dataSourceConfig,
            trigger: 'change'
          }
        ],
        metadataConfig: [
          {
            required: true,
            message: this.$t('shardingsphere.ruleConfig').schemaRules.metadataConfig,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    textarea2() {
      const shardingYamlType = new yaml.Type(
        '!SHARDING',
        {
          kind: 'mapping',
          construct(data) {
            return data !== null ? data : {}
          }
        }
      )
      const encryptYamlType = new yaml.Type(
        '!ENCRYPT',
        {
          kind: 'mapping',
          construct(data) {
            return data !== null ? data : {}
          }
        }
      )
      const masterSlaveYamlType = new yaml.Type(
        '!READ_WRITE_SPLITTING',
        {
          kind: 'mapping',
          construct(data) {
            return data !== null ? data : {}
          }
        }
      )
      const shadowYamlType = new yaml.Type(
        '!SHADOW',
        {
          kind: 'mapping',
          construct(data) {
            return data !== null ? data : {}
          }
        }
      )
      const DS_SCHEMA = yaml.Schema.create([shardingYamlType, encryptYamlType, masterSlaveYamlType, shadowYamlType])
      return JSON.stringify(
        yaml.load(this.textarea, { schema: DS_SCHEMA }),
        null,
        '\t'
      )
    }
  },
  created() {
    this.getSchema()
  },
  methods: {
    add() {
      this.addSchemaDialogVisible = true
    },
    handlerClick(parent, child) {
      if (child === 'rule') {
        this.$$api_shardingsphere5_getSchemaRule({
          data: {id: parent},
          fn: json => {
            const res = json.data;
            this.renderYaml(parent, child, res)
          },errFn: () => {

          }
        })
      } else if (child === 'datasource') {
        this.$$api_shardingsphere5_getSchemaDataSource({
          data: {id: parent},
          fn: json => {
            const res = json.data;
            this.renderYaml(parent, child, res)
          },errFn: () => {

          }
        })
      } else {
        this.$$api_shardingsphere5_getSchemaMetadata({
          data: {id: parent},
          fn: json => {
            const res = json.data;
            this.renderMetadataYaml(parent, child, res)
          },errFn: () => {

          }
        })

      }
    },
    renderMetadataYaml(parent, child, res) {
      if (!res.success) return
      const model = res.model
      if (Object.prototype.toString.call(model) === '[object String]') {
        this.textarea = model
      } else {
        this.textarea = JSON.stringify(model, null, '\t')
      }
      this.sname = parent
      this.scname = child
      this.type = `${parent}-${child}`
      this.showMetadataDialogVisible = true
    },
    renderYaml(parent, child, res) {
      if (!res.success) return
      const model = res.model
      if (Object.prototype.toString.call(model) === '[object String]') {
        this.textarea = model
      } else {
        this.textarea = JSON.stringify(model, null, '\t')
      }
      this.sname = parent
      this.scname = child
      this.type = `${parent}-${child}`
      this.centerDialogVisible = true
    },
    getSchema() {
      this.$$api_shardingsphere5_getSchema({
        data: {},
        fn: json => {
          const res = json.data;
          const data = res.model
          const base = ['rule', 'datasource', 'metadata']
          const newData = []
          for (const v of data) {
            newData.push({
              title: v,
              children: base
            })
          }
          this.schemaData = newData
        },errFn: () => {

        }
      })
    },
    onConfirm() {
      if (this.scname === 'rule') {
        this.$$api_shardingsphere5_putSchemaRule({
          data: {sname: this.sname, ruleConfig: this.textarea },
          fn: json => {
            const res = json.data;
            this._onConfirm(res)
          },errFn: () => {

          }
        })
      } else {
        this.$$api_shardingsphere5_putSchemaDataSource({
          data: {sname: this.sname, dataSourceConfig: this.textarea },
          fn: json => {
            const res = json.data;
            this._onConfirm(res)
          },errFn: () => {

          }
        })

      }
    },
    _onConfirm(res, type) {
      if (res.success) {
        this.$notify({
          title: this.$t('shardingsphere.common').notify.title,
          message: this.$t('shardingsphere.common').notify.updateCompletedMessage,
          type: 'success'
        })
        this.centerDialogVisible = false
        if (type === 'ADD_SCHEMA') {
          this.addSchemaDialogVisible = false
          this.getSchema()
        }
      } else {
        this.$notify({
          title: this.$t('shardingsphere.common').notify.title,
          message: this.$t('shardingsphere.common').notify.updateFaildMessage,
          type: 'error'
        })
      }
    },
    addSchema(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$$api_shardingsphere5_addSchema({
            data: {
              name: this.form.name,
              ruleConfiguration: this.form.ruleConfig,
              dataSourceConfiguration: this.form.dataSourceConfig
            },
            fn: json => {
              const res = json.data;
              this._onConfirm(res, 'ADD_SCHEMA')
            },errFn: () => {

            }
          })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleDelete(schemaName) {
      this.deleteDialogVisible = true
      this.schemaName = schemaName
    },
    deleteSchema() {
      this.$$api_shardingsphere5_deleteSchema({
        data: {name: this.schemaName},
        fn: json => {
          const res = json.data;
          this.$notify({
            title: this.$t('shardingsphere.common').notify.title,
            message: this.$t('shardingsphere.common').notify.delSucMessage,
            type: 'success'
          })
          this.deleteDialogVisible = false
          this.schemaName = ''
          this.getSchema()
        },errFn: () => {

        }
      })

    }
  }
}
</script>
<style lang='scss'>
.schema {
  margin-top: 20px;
  .coll-item {
    height: 16px;
    line-height: 16px;
    width: 100%;
    float: left;
    margin-bottom: 22px;
    .txt {
      color: rgb(51, 51, 51);
      font-size: 14px;
      padding-left: 10px;
      float: left;
      margin-right: 10px;
    }
    .itm {
      float: left;
      width: 16px;
      height: 16px;
    }
    .icon-0 {
      background: url('../../../../../../static/images/shardingsphere/rules.png') no-repeat left center;
    }
    .icon-1 {
      background: url('../../../../../../static/images/shardingsphere/data-source.png') no-repeat left
        center;
    }
    .icon-2 {
      background: url('../../../../../../static/images/shardingsphere/meta-data.png') no-repeat left
        center;
    }
    .edit-btn {
      float: right;
    }
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-collapse-item__header {
    font-size: 16px;
  }
  .edit-text {
    margin-top: 5px;
    textarea {
      background: #fffffb;
    }
  }
  .show-text {
    margin-top: 5px;
    textarea {
      background: rgb(246, 246, 246);
    }
  }
  .icon-edit {
    background: url('../../../../../../static/images/shardingsphere/edit.png') no-repeat left center;
    width: 16px;
    height: 16px;
    display: inline-block;
    float: right;
    cursor: pointer;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-input {
    width: 30%;
  }
  .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
  .el-icon-delete {
    color: #F56C6C;
    float: right;
    cursor: pointer;
  }
}
</style>
