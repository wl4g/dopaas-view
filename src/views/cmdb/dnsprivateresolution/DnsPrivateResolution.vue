<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item label="域名">
                <!--<el-input v-model="searchParams.host" placeholder="e.g. host" style="width:165px"></el-input>-->
                {{searchParams.zone}}
            </el-form-item>
            <el-form-item label="子域名">
                <el-input v-model="searchParams.host" placeholder="e.g. host" style="width:165px"></el-input>
            </el-form-item>
            <input hidden></input>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>

            <el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >+ Add</el-button>
            <el-button type="primary" style='float:right;margin-right:20px' @click="back()" >Back</el-button>
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
                    <el-table-column prop="host" label="域名"></el-table-column>
                    <el-table-column prop="resolveType" label="类型">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('erm_dns_resolve_type',scope.row.resolveType)">{{dictutil.getDictLabelByTypeAndValue('erm_dns_resolve_type',scope.row.resolveType)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" label="记录值"></el-table-column>
                    <el-table-column prop="ttl" label="TTL"></el-table-column>
                    <el-table-column prop="priority" label="优先级"></el-table-column>
                    <el-table-column prop="lineIsp" label="解析线路"></el-table-column>

                    <el-table-column :label="$t('message.common.operation')" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="域名" prop="host">
                            <el-input v-model="saveForm.host" placeholder="e.g: @"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型" prop="resolveType">
                            <el-select v-model="saveForm.resolveType" style="width: 100%">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('erm_dns_resolve_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="记录值" prop="value">
                            <el-input v-model="saveForm.value" placeholder="e.g. 192.168.1.2"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="TTL" prop="ttl">
                            <el-input v-model="saveForm.ttl" placeholder="e.g. 300"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="优先级" prop="priority">
                            <el-input v-model="saveForm.priority" :disabled="saveForm.resolveType!='mx'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="解析线路" prop="lineIsp">
                            <!--<el-input v-model="saveForm.lineIsp"></el-input>-->
                            <el-select v-model="saveForm.lineIsp" style="width: 100%">
                                <el-option label="默认" value="default"></el-option>
                            </el-select>
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
    import DnsPrivateResolution from './DnsPrivateResolution.js'

    export default DnsPrivateResolution
</script>

<style scoped>

</style>

