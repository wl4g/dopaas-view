<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input clearable v-model="searchParams.name" placeholder="e.g. abc" style="width:165px"></el-input>
            </el-form-item>
            <input hidden></input>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>

            <!--<el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >+ Add</el-button>-->
        </el-form>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <div class="query">
            <div class="query-left">
                <div class="line"></div>
                Result Total： <span class="number">{{total}}</span>
            </div>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
                    <el-table-column prop="clusterName" :label="$t('message.common.name')"></el-table-column>

                    <el-table-column prop="defaultEnv" label="默认环境">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.defaultEnv">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('app_ns_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                    <el-table-column prop="defaultEnv" label="默认分支">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.defaultBranch"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column :label="$t('message.common.operation')" width="120">
                        <template slot-scope="scope">
                            <el-button v-if="permitutil.hasPermit('uci:clusterextension:edit')" :disabled="scope.row.defaultEnvO==scope.row.defaultEnv && scope.row.defaultBranchO==scope.row.defaultBranch" type="primary" icon='edit' @click="saveData(scope.row)">{{$t('message.common.save')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

    </section>
</template>


<script>
    import ClusterExtension from './ClusterExtension.js'

    export default ClusterExtension
</script>

<style scoped>

</style>

