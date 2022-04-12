<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="e.g. Gitlab" style="width:150px;"></el-input>
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
                {{$t('message.common.total')}}:<span class="number">{{total}}</span>
            </div>
            <!-- 新增按钮 -->
            <!--<el-button type="primary" @click="addData()">+ Add&nbsp;</el-button>-->
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column width="100" prop="id" label="ID"></el-table-column>
                    <el-table-column prop="engineName" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="startTime" :label="$t('message.common.startTime')"></el-table-column>
                    <el-table-column prop="endTime" :label="$t('message.common.endTime')" ></el-table-column>
                    <el-table-column prop="costTime" :label="$t('message.umc.costTime')" ></el-table-column>
                    <el-table-column prop="state" :label="$t('message.common.status')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('ci_task_type',scope.row.state)">{{dictutil.getDictLabelByTypeAndValue('ci_task_type',scope.row.state)}}</el-tag>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="createBy" :label="$t('message.common.createBy')"></el-table-column>-->
                    <!--<el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>-->
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>


    </section>
</template>


<script>
    import History from './History.js'

    export default History
</script>

<style scoped>

</style>

