<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item label="表达式">
                <el-input v-model="searchParams.expression" placeholder="" style="width:165px"></el-input>
            </el-form-item>
            <input hidden></input>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>

            <el-button type="primary" style='float:right;margin-right:20px' @click="back()">Back</el-button>

            <el-button type="primary" style='float:right;margin-right:20px' @click="addData()">+ Add</el-button>
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
                    <el-table-column prop="expression" label="表达式"></el-table-column>
                    <el-table-column prop="type" label="类型">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('erm_dns_blacklist_type',scope.row.type)">
                                {{dictutil.getDictLabelByTypeAndValue('erm_dns_blacklist_type',scope.row.type)}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="enable" label="启用">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('common_enable_status',scope.row.enable)">
                                {{dictutil.getDictLabelByTypeAndValue('common_enable_status',scope.row.enable)}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="120">
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
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" v-loading='dialogLoading' width="30%">
            <el-form label-width="100px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="表达式" prop="expression">
                            <el-input v-model="saveForm.expression" placeholder="e.g: *.example.com(仅支持*号匹配)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="类型" prop="type">
                            <el-select v-model="saveForm.type" style="width: 100%">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('erm_dns_blacklist_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="启用" prop="enable">
                            <el-switch v-model="saveForm.enable" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="saveForm.remark"></el-input>
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
    import DnsPrivateBlacklist from './DnsPrivateBlacklist.js'

    export default DnsPrivateBlacklist
</script>

<style scoped>

</style>

