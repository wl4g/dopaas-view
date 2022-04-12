<template>
  <section class="application">
      <!-- //表单 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">

      <el-form-item :label="$t('message.common.group')">
        <el-select v-model="formInline.region" placeholder="请选择Group:">
          <el-option label="sso" value="sso"></el-option>
          <el-option label="portal" value="portal"></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="Node:">
        <el-select v-model="formInline.region" placeholder="请选择Node:">
          <el-option label="192.212.1.101/sso-node1:8080" value="12134"></el-option>
          <el-option label="192.212.1.102/sso-node2:8080" value="12415"></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-button type="success" @click="onSubmit">{{ $t('message.common.search') }}</el-button>
      </el-form-item>
      <el-form-item style='float:right'>
        <el-button type="primary" @click="onSubmit">{{ $t('message.common.add') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 查询结果数值 -->
    <div class="query">
      <div class="line"></div>
      <div class="">查询结果：共查询到 <span class="number">60</span> 条满足要求的配置</div>
    </div>

    <!-- 查询结果表格 -->
    <div>
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="group"
            :label="$t('message.common.group')"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="node"
            :label="$t('message.scm.node')"
            :formatter="formatter">
          </el-table-column>
          <el-table-column
            prop="address"
            :label="$t('message.common.remark')"
            :formatter="formatter">
          </el-table-column>
          <el-table-column :label="$t('message.common.operation')"
            >
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('message.common.del')}}</el-button>
              <el-button type="text" size="small">{{$t('message.common.edit')}}</el-button>
            </template>
          </el-table-column>

        </el-table>
      </template>
    </div>

  </section>
</template>
<script>
  import Application from './Application.js'

  export default Application
</script>
<style scoped>
  .number{
    font-weight: bold;color: #6cb33e;
  }
</style>
