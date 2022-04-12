<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input clearable v-model="searchParams.name" placeholder="e.g. localhost" style="width:165px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.ci.cluster')">
                <el-select clearable search v-model="searchParams.clusterId" filterable style="width: 100%">
                    <el-option
                            v-for="item in clusters"
                            :key="item.id"
                            :label="item.name+'  ('+item.remark+')'"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('message.ci.env')">
                <el-select clearable v-model="searchParams.envType" style="width: 100%">
                    <el-option
                            v-for="item in dictutil.getDictListByType('app_ns_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <!--<el-form-item label="服务类型">
                <el-select clearable v-model="searchParams.deployType" style="width: 100%">
                    <el-option
                            v-for="item in dictutil.getDictListByType('erm_server_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>-->

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
                <el-table :data="tableData" style="width:100%" :border="false">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="clusterName" :label="$t('message.ci.cluster')"></el-table-column>


                    <el-table-column prop="envType" :label="$t('message.ci.env')" width=95>
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('app_ns_type',scope.row.envType)">{{dictutil.getDictLabelByTypeAndValue('app_ns_type',scope.row.envType)}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="enable" :label="$t('message.common.enable')" width=95>
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('common_enable_status',scope.row.enable)">{{dictutil.getDictLabelByTypeAndValue('common_enable_status',scope.row.enable)}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column :label="$t('message.common.operation')" width="150">
                        <template slot-scope="scope">
                            <el-button v-if="permitutil.hasPermit('cmdb:instance:edit')" type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="pageNum" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.cluster')" prop="clusterId">
                            <el-select v-model="saveForm.clusterId" style="width: 100%" filterable @change="onChangeCluster">
                                <el-option
                                        v-for="item in clusters"
                                        :key="item.id"
                                        :label="item.name+'  ('+item.remark+')'"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.env')" prop="envType">
                            <el-select v-model="saveForm.envType" style="width: 100%">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('app_ns_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" v-if="saveForm.deployType==1 && isEdit">
                        <el-form-item label="主机" prop="hostId">
                            <el-select v-model="saveForm.hostId" style="width: 100%">
                                <el-option
                                        v-for="item in hosts"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" v-if="saveForm.deployType==2">
                        <el-form-item label="Docker" prop="dockerId">
                            <el-select v-model="saveForm.dockerId" style="width: 100%" filterable>
                                <el-option
                                        v-for="item in dockers"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" v-if="saveForm.deployType==3">
                        <el-form-item label="K8s" prop="k8sId">
                            <el-select v-model="saveForm.k8sId" style="width: 100%" filterable>
                                <el-option
                                        v-for="item in k8ss"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" v-if="saveForm.deployType==4">
                        <el-form-item label="存储Bucket" prop="cossRefBucket">
                            <el-select v-model="saveForm.cossRefBucket" style="width: 100%" filterable>
                                <el-option
                                        v-for="item in cossBuckets"
                                        :label="item.provider+':'+item.bucketName"
                                        :value="item.provider+':'+item.bucketName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="saveForm.deployType==1 && !isEdit">
                    <el-col :span="24">
                        <el-form-item label="主机" prop="hosts">
                            <el-transfer
                                    filterable
                                    filter-placeholder="Search"
                                    v-model="saveForm.hosts"
                                    :titles="['可选择主机', '已选择主机']"
                                    :data="hosts"
                                    :props="{
                                      key: 'id',
                                      label: 'name'
                                    }"
                            >
                            </el-transfer>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.common.enable')" prop="enable">
                            <el-switch v-model="saveForm.enable" :active-value="1" :inactive-value="0"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.common.remark')" prop="remark">
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
    import Instance from './Instance.js'

    export default Instance
</script>

<style scoped>

</style>

