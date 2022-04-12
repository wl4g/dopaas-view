<template>
  <div>
    <div v-if="!showMenu">
      <div class="top">
        <div class="top-title">集群列表</div>
        <div class="top-right">
          <el-select v-model="value" placeholder="请选择" class="top-select" :popper-append-to-body="false">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button>刷新</el-button>
          <el-button type="success">集群模板</el-button>
          <el-button type="success">创建集群</el-button>
        </div>
      </div>
      <div class="search">
          <el-select v-model="searchValue" placeholder="请选择" class="search-select">
              <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
          <el-input class="searchInput"></el-input>
          <el-button icon="el-icon-search"></el-button>
          <el-button >标签</el-button>
      </div>
      <!-- 查询结果表格 -->
      <div>
          <template>
              <el-table :data="tableData" :border="false" style="width:100%">
                  <el-table-column label="集群名称/ID" >
                      <template slot-scope="scope">
                          <div class="clusterName">
                              <a style="color:#2b9aed" @click="linkTo()">{{scope.row.name}}</a>
                              <a style="color:#a2aaba">{{scope.row.id}}</a>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="name" label="标签"></el-table-column>
                  <el-table-column prop="masterAddr" label="集群类型"></el-table-column>
                  <el-table-column prop="secondaryMasterAddr" label="地域"></el-table-column>
                  <el-table-column prop="secondaryMasterAddr" label="集群状态"></el-table-column>
                  <el-table-column prop="secondaryMasterAddr" label="节点数"></el-table-column>
                  <el-table-column prop="secondaryMasterAddr" label="使用量"></el-table-column>
                  <el-table-column prop="secondaryMasterAddr" label="创建时间"></el-table-column>
                  <el-table-column prop="secondaryMasterAddr" label="版本"></el-table-column>
                  <el-table-column label="操作" min-width="120">
                      <template slot-scope="scope">
                          <el-button type="danger" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </template>
      </div>

    </div>
    <clusterMenu v-if="showMenu" @isback='isback' />
  </div>
</template>
<script >
import cluster from './cluster.js'

export default cluster
</script>

<style  lang='less' scoped>
.top{
  display: flex;
  justify-content: space-between;
}
.top-title{
  font-size: 20px;
  font-weight: bold;
}
.top-select .el-input__inner{
  border: 0 !important;
  color: #20a1ff !important;
}
.search{
    padding: 10px;
    display: flex;
}
.search-select{
    width: 72px !important;
}
.search .searchInput{
    padding-left: 8px;
    width: 250px;
}
.clusterName a{
    cursor: pointer;
    display: flex;
    flex-direction: column;
}
</style>