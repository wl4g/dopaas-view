<template>
  <section id="configuration" class="configuration">
    <el-form
      :inline="true"
      :model="searchParams"
      class="searchbar"
      @keyup.enter.native.prevent="onSubmit()"
    >
      <el-form-item :label="$t('message.common.name')">
        <el-input
          v-model="searchParams.projectName"
          placeholder="e.g. localhost"
          style="width:165px"
        ></el-input>
        <input type="text" style="display:none;" />
      </el-form-item>
      <el-form-item>
        <el-button
          @click="onSubmit"
          type="success"
          :loading="loading"
        >{{$t('message.common.search')}}</el-button>
      </el-form-item>

      <el-button type="primary" style="float:right;margin-right:20px" @click="addData()">{{$t('message.common.add')}} GenProject</el-button>
    </el-form>

    <!--================================table================================-->
    <!-- 查询结果数值 -->
    <div class="query">
      <div class="query-left">
        <div class="line"></div>Result Total：
        <span class="number">{{total}}</span>
      </div>
    </div>
    <!-- 查询结果表格 -->
    <div>
      <template>
        <el-table :data="tableData" :border="false" style="width:100%">
          <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
          <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
          <el-table-column prop="projectName">
            <template slot="header" slot-scope="scope">
              <!-- <span>{{$t('message.common.name')}}</span> -->
              <span>项目名</span>
              <el-tooltip class="item" effect="dark" content="待生成的项目名称" placement="right">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <a style="cursor:pointer" @click="toTable(scope.row)">{{scope.row.projectName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="organName" label="公司名" :show-overflow-tooltip="true"></el-table-column>
          <!--<el-table-column prop="packageName" label="包名" :show-overflow-tooltip="true"></el-table-column>-->
          <el-table-column prop="version" label="版本号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="author" label="作者信息" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="since" :show-overflow-tooltip="true">
            <template slot="header" slot-scope="scope">
              <!-- <span>{{$t('message.common.name')}}</span> -->
              <span>引入号</span>
              <el-tooltip class="item" effect="dark" content="如，java的@since注解，表示此api从哪个版本开始引进的" placement="right">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="humanUpdateDate" label="更新时间" min-width="80"></el-table-column>
          <el-table-column :label="$t('message.common.operation')" min-width="140">
            <template slot-scope="scope">
              <el-button type="primary" icon="edit" @click="generate(scope.row)" :loading="scope.row.generating">{{scope.row.generating?'生成中...':'一键生成'}}</el-button>
              <el-button v-if="permitutil.hasPermit('udc:project:edit')"
                type="text"
                icon="el-icon-edit"
                @click="editData(scope.row)"
                :title="$t('message.common.edit')"
                size="mini"
              ></el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="delData(scope.row)"
                :title="$t('message.common.del')"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="currentChange"
    ></el-pagination>
  </section>
</template>

<script>
import Project from "./Project.js";
export default Project;
</script>

<style scoped>
</style>
