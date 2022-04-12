<template>
  <el-row class="box-card">
    
    <div class="btnGroup">
      <el-button
        :disabled="isGuest"
        class="btn-plus"
        type="primary"
        @click="add"
      >创建AccessKey</el-button>
      <el-button
        class="btn-plus"
        type="primary"
        @click="add"
      >刷新</el-button>
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
                @click="handleDetail(scope.row)">查看 Secret</el-button>
              <el-button
                :disabled="isGuest"
                size="mini"
                type="primary"
                plain
                @click="handleModify(scope.row)">禁用</el-button>
              <el-button
                :disabled="isGuest"
                size="mini"
                type="primary"
                plain
                @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" title="手机验证" class="code" >
        <el-form size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
            <el-row style="padding: 5px 60px;display:flex">
                <div style="width:60px">
                    绑定的手机
                </div>
                <div style="padding-left:12px">{{saveForm.phoneNumber}}</div>
                <div style="padding-left:12px;color:#0049c7;cursor: pointer;">更换手机</div>
            </el-row>
            <el-row style="padding: 5px 60px;display:flex;align-items: center;">
                <div style="width:60px;text-align:right">
                    校验码
                </div>
                <el-input style="width:120px;padding-left:12px" v-model="saveForm.verificationCode " placeholder="请输入验证码"></el-input>
                <el-button style="margin-left:12px" type="primary" @click="sendVerificationCode" :disabled='codeButtonType'>{{codeText}}</el-button>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" >确定</el-button>
            <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="detialVisible" title="查看 Secret" class="code" >
        <div style="padding: 0 20px;background: #fffcd2;">
            <div style="display:flex;padding:5px">
                <div style="width:120px">AccessKey</div><div>{{keyMessage}}</div>
                <div style="padding-left:20px;cursor: pointer;" v-clipboard:success="copyAccessKey" v-clipboard:copy="keyMessage"><i class="el-icon-document-copy"></i> 复制</div>
            </div>
            <div style="display:flex;padding:5px">
                <div style="width:120px">AccessSecret</div><div>{{message}}</div>
                <div style="padding-left:20px;cursor: pointer;" v-clipboard:success="copyAccessSecret" v-clipboard:copy="message"><i class="el-icon-document-copy"></i> 复制</div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="detialVisible = false;">确定</el-button>
        </span>
    </el-dialog>
  </el-row>
</template>

<script>
import AccessKey from "./accessKey.js";
export default AccessKey;
</script>

<style>
.btnGroup {
  margin-bottom: 20px;
}
.code .el-dialog{
    width: 450px !important;
}
</style>