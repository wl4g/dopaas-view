<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="e.g. Gitlab" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.ci.vcsProvider')">
                <el-select clearable v-model="searchParams.providerKind">
                    <el-option
                            v-for="item in dictutil.getDictListByType('vcs_provider')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.ci.authType')">
                <el-select clearable v-model="searchParams.authType">
                    <el-option
                            v-for="item in dictutil.getDictListByType('vcs_auth_type')"
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
            <el-button type="primary" @click="addData()">+ Add VCS Provider&nbsp;</el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column width="100" prop="id" label="ID"></el-table-column>
                    <el-table-column prop="name" :label="$t('message.common.name')">
                        <template slot-scope="scope">
                            <a style="cursor:pointer" @click="vcsManager(scope.row)">
                                {{scope.row.name}}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="providerKind" :label="$t('message.ci.vcsProvider')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('vcs_provider',scope.row.providerKind)">{{dictutil.getDictLabelByTypeAndValue('vcs_provider',scope.row.providerKind)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="authType" :label="$t('message.ci.authType')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('vcs_auth_type',scope.row.authType)">{{dictutil.getDictLabelByTypeAndValue('vcs_auth_type',scope.row.authType)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="baseUri" :label="$t('message.common.baseUrl')"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="info" icon='edit' @click="vcsManager(scope.row)">管理</el-button>
                            <el-button type="danger" icon='delete' @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" size="small" v-loading='dialogLoading'>
            <el-form label-width="135px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.vcsProvider')" prop="providerKind">
                            <el-select v-model="saveForm.providerKind">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('vcs_provider')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.authType')" prop="authType">
                            <el-select v-model="saveForm.authType">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('vcs_auth_type')"
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
                        <el-form-item :label="$t('message.common.baseUrl')" prop="baseUri">
                            <el-input v-model="saveForm.baseUri"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="saveForm.authType==1">
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.username')" prop="username">
                            <el-input v-model="saveForm.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.password')" prop="password">
                            <el-input type="password" v-model="saveForm.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="saveForm.authType!=1">
                    <el-col :span="24">
                        <el-form-item :label="$t('message.common.sshKey')" prop="sshKey">
                            <el-input v-model="saveForm.sshKey"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="saveForm.authType!=1">
                    <el-col :span="24">
                        <el-form-item :label="$t('message.common.sshKeyPub')" prop="sshKeyPub">
                            <el-input v-model="saveForm.sshKeyPub"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.common.accessToken')" prop="accessToken">
                            <el-col :span="22">
                                <el-input v-model="saveForm.accessToken"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-tooltip placement="top">
                                    <div slot="content">请求api所用,以gitlab为例,在user setting下的access token可以找到</div>
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-col>
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
    import Repository from './Repository.js'

    export default Repository
</script>

<style scoped>

</style>

