<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input clearable v-model="searchParams.name" placeholder="e.g. Gitlab" style="width:150px;"></el-input>
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
            <el-button type="primary" @click="addData()">+ Add Label&nbsp;</el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column width="100" prop="id" label="ID"></el-table-column>
                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" size="small" v-loading='dialogLoading'>
            <el-form label-width="165px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveData()" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                        <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
                    </span>
        </el-dialog>
    </section>
</template>


<script>
    import Label from './Label.js'

    export default Label
</script>

<style scoped>

</style>

