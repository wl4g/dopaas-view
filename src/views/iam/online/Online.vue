<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" ref="searchForm" @keyup.enter.native="onSubmit()" :rules="rules">
            <el-form-item :label="$t('message.iam.server')" prop="id">
                <el-select v-model="searchParams.id" >
                    <el-option
                            v-for="item in iamServers"
                            :key="item.id"
                            :label="item.appName+'-'+item.envType"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.principal"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>
        </el-form>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <div class="query">
            <div class="query-left">
                <div class="line"></div>
            </div>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table height="700px" :data="tableData" :border="false" style="width: 100%" 
                v-table-scroll="lazyLoad" 
                ref='table' 
                v-loading="loading"  element-loading-background = "rgba(0, 0, 0, 0.5)" element-loading-text = "数据正在加载中" element-loading-spinner = "el-icon-loading">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column prop="id" label="ID">
                        <template slot-scope="scope">

                            <el-tooltip class="item" effect="dark" :content="scope.row.id" placement="right">
                                <label>{{subStr(scope.row.id)}}</label>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="principal" :label="$t('message.iam.principal')" width="70"></el-table-column>
                    <el-table-column prop="host" :label="$t('message.iam.host')" width="110"></el-table-column>
                    <el-table-column prop="startTime" :label="$t('message.iam.startTime')" width="120"></el-table-column>
                    <el-table-column prop="lastAccessTime" :label="$t('message.iam.lastAccessTime')" width="120"></el-table-column>
                    <el-table-column prop="clientRef" :label="$t('message.iam.clientRef')"></el-table-column>
                    <el-table-column prop="authenticated" :label="$t('message.iam.authenticated')" :formatter="convertType"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" width="120">
                        <template slot-scope="scope">
                            <el-button type="danger" class="el-icon-circle-close"  @click="destroySessions(scope.row)" :loading="loading">{{$t('message.iam.destroy')}}</el-button>
                        </template>
                    </el-table-column>
                    <div>123123</div>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>
    </section>
</template>


<script>
    import Online from './Online.js'

    export default Online
</script>

<style scoped>

</style>
