<template>

    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">

            <el-form-item :label="$t('message.common.name')">
                <el-input clearable v-model="searchParams.clusterName" placeholder="Name"></el-input>
            </el-form-item>
            <el-form-item label="服务类型">
                <el-select clearable v-model="searchParams.deployType" style="width: 100%">
                    <el-option
                            v-for="item in dictutil.getDictListByType('erm_server_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <input type="text" style="display:none" />

            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>
        </el-form>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <div class="query">
            <div class="query-left">
                <div class="line"></div>
                Result Total： <span class="number">{{total}}</span>
            </div>
            <!-- 新增按钮 -->
            <el-button type="primary" @click="addData()" > + </el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width: 100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column prop="id" label="ID"></el-table-column>-->
                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="instanceCount" :label="$t('message.ci.instances')"></el-table-column>
                    <el-table-column prop="endpoint" :label="$t('message.common.endpoint')"></el-table-column>
                    <el-table-column prop="deployType" label="服务类型" width=95>
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('erm_server_type',scope.row.deployType)">{{dictutil.getDictLabelByTypeAndValue('erm_server_type',scope.row.deployType)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" :label="$t('message.common.remark')" ></el-table-column>


                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button v-if="permitutil.hasPermit('cmdb:cluster:edit')" type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="pageNum" @current-change='currentChange'></el-pagination>
    </section>
</template>
<script>
    import Cluster from './Cluster.js'
    export default Cluster
</script>
<style scoped>
</style>
