<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">

            <el-form-item :label="$t('message.common.group')">
                <el-cascader
                        :options="vcsGroups"
                        v-model="searchParams.groupIds"
                        :props="props"
                        filterable
                        clearable
                        :show-all-levels="false"
                        @change="onChangeGroup">
                </el-cascader>
            </el-form-item>

            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.projectName" placeholder="e.g. sso" style="width:150px;"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="onSubmit" type="success">{{$t('message.common.search')}}</el-button>
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
            <el-button type="primary" @click="back()">back</el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column width="50" prop="id" label="ID"></el-table-column>
                    <el-table-column width="200" prop="name" :label="$t('message.common.name')">
                        <template slot-scope="scope">
                            <a style="cursor:pointer" @click="toProjectDetail(scope.row)">
                                {{scope.row.name}}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" prop="created_at" :label="$t('message.common.createDate')" :formatter="dateformat"></el-table-column>
                    <el-table-column width="150" prop="last_activity_at" :label="$t('message.common.updateDate')" :formatter="dateformat"></el-table-column>
                    <el-table-column prop="description" label="description"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" width="100">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="toProjectDetail(scope.row)">{{$t('message.common.detail')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

    </section>
</template>


<script>
    import Project from './Project.js'

    export default Project
</script>

<style scoped>

</style>

