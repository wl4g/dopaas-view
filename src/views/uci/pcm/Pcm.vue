<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="e.g. Gitlab" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.ci.pcmProvider')">
                <el-select clearable v-model="searchParams.provider">
                    <el-option
                            v-for="item in dictutil.getDictListByType('pcm_provider')"
                            :key="item.value"
                            :label="item.label"
                            :disabled="item.enable!=1"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.ci.authType')">
                <el-select clearable v-model="searchParams.authType">
                    <el-option
                            v-for="item in dictutil.getDictListByType('pcm_auth_type')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
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
            <el-button type="primary" @click="addData()">+ Add Pcm Provider&nbsp;</el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="providerKind" :label="$t('message.ci.pcmProvider')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('pcm_provider',scope.row.providerKind)">{{dictutil.getDictLabelByTypeAndValue('pcm_provider',scope.row.providerKind)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="authType" :label="$t('message.ci.authType')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('pcm_auth_type',scope.row.authType)">{{dictutil.getDictLabelByTypeAndValue('pcm_auth_type',scope.row.authType)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="baseUrl" :label="$t('message.common.baseUrl')"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button v-if="permitutil.hasPermit('uci:pcm:edit')" type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change='currentChange'></el-pagination>

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
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.pcmProvider')" prop="providerKind">
                            <el-select v-model="saveForm.providerKind">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('pcm_provider')"
                                        :key="item.value"
                                        :label="item.label"
                                        :disabled="item.enable!=1"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="12">
                        <el-form-item :label="$t('message.ci.authType')" prop="authType">
                            <el-select v-model="saveForm.authType">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('pcm_auth_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.common.baseUrl')" prop="baseUrl">
                            <el-input v-model="saveForm.baseUrl"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row v-if="saveForm.authType==1">
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.username')" prop="username">
                            <el-input v-model="saveForm.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.password')" prop="password">
                            <el-input v-model="saveForm.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>-->
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.common.accessToken')" prop="accessToken">
                            <el-input v-model="saveForm.accessToken"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :offset="4" :span="20">
                        <p style="font-size:10px;color:red">请使用redmine管理员账号登录，配置=>API认证=>允许XXX，然后打开"我的账号"右侧会出现API token</p>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <organization-selector :inputData="{organizationCode: saveForm.organizationCode}" @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
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
    import Pcm from './Pcm.js'

    export default Pcm
</script>

<style scoped>

</style>

