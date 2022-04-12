<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="e.g. localhost" style="width:165px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>

            <el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >+ Add</el-button>
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
                    <el-table-column prop="name">
                        <template slot="header" slot-scope="scope">
                            <!-- <span>{{$t('message.common.name')}}</span> -->
                            <span>数据源名称</span>
                            <el-tooltip class="item" effect="dark" content="生成器数据源信息" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <a style="cursor:pointer" @click="editData(scope.row)">{{scope.row.name}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型"></el-table-column>
                    <el-table-column prop="host" label="地址"></el-table-column>
                    <el-table-column prop="port" label="端口"></el-table-column>
                    <el-table-column prop="database" label="数据库名"></el-table-column>
                    <el-table-column prop="username" label="账号"></el-table-column>
                    <el-table-column prop="remark" label="备注"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="80">
                        <template slot-scope="scope">
                            <!--<el-button type="success"  @click="testConnectDb(scope.row)">测试连接</el-button>-->
                            <el-button type="text" icon="el-icon-edit" @click="editData(scope.row)" :title="$t('message.common.edit')"></el-button>
                            <el-button type="text" icon="el-icon-delete" @click="delData(scope.row)" :title="$t('message.common.del')"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  v-loading='dialogLoading'>
            <el-form label-width="90px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数据库类型" prop="type">
                            <el-select v-model="saveForm.type">
                                <el-option label="MySQLV5" value="mysqlv5"></el-option>
                                <el-option disabled label="PostgreSQL" value="postgresql"></el-option>
                                <el-option disabled label="Oracle" value="oracle"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="地址" prop="host">
                            <el-input v-model="saveForm.host"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="端口" prop="port">
                            <el-input type="number" v-model="saveForm.port"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="账号" prop="username">
                            <el-input v-model="saveForm.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="saveForm.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="数据库名" prop="database">
                            <el-input v-model="saveForm.database"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="saveForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="success"  @click="testConnectDb()">测试连接</el-button>
                <el-button type="primary" @click="saveData()" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
    import Database from './Database.js'
    export default Database
</script>
<style scoped>
</style>

