<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native.prevent="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.zone" placeholder="e.g. example" style="width:165px"></el-input>
            </el-form-item>
            <input hidden></input>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>

            <el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >+ Add</el-button>
            <el-button type="primary" style='float:right;margin-right:20px' @click="toBlacklist()" >黑白名单</el-button>
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
                <el-table :data="tableData" style="width:100%" :border="false">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
                    <el-table-column prop="zone" label="域名">
                        <template slot-scope="scope">
                                <a style="cursor:pointer" @click="toManager(scope.row)">
                                    {{scope.row.zone}}
                                </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dueDate" label="有效期至"></el-table-column>
                    <el-table-column prop="status" label="状态"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button v-if="permitutil.hasPermit('cmdb:dnsprivatedomain:edit')" type="success" icon='edit' @click="toManager(scope.row)">管理</el-button>
                            <el-button type="danger" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  v-loading='dialogLoading' width="30%">
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="域名" prop="zone">
                            <el-input v-model="saveForm.zone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="有效期至" prop="dueDate">
                            <el-date-picker
                                    v-model="saveForm.dueDate"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                            </el-date-picker>
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
    import DnsPrivateDomain from './DnsPrivateDomain.js'

    export default DnsPrivateDomain
</script>

<style scoped>

</style>

