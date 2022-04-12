<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="e.g. localhost" style="width:165px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.iam.host')">
                <el-input v-model="searchParams.hostname" placeholder="e.g. localhost" style="width:165px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>
        </el-form>
        <div style="float: right">
            <el-button style="float: right;margin-left: 10px" type="primary" @click="addData()" >+ Add Host</el-button>
            <el-button style="float: right;margin-left: 10px" type="primary" @click="openImportDialog()" >导入</el-button>
        </div>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <div>
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
                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="hostname" :label="$t('message.iam.host')"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="openTestConnect(scope.row)">{{$t('message.share.connectTest')}}</el-button>

                            <el-dropdown @command="handleCommand" trigger="click">
                              <span class="el-dropdown-link">
                                  <el-button type="text">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                              </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="permitutil.hasPermit('cmdb:host:edit')" :command="{action:'editData',row: scope.row}">{{$t('message.common.edit')}}</el-dropdown-item>
                                    <el-dropdown-item :command="{action:'toNetcard',row: scope.row}">网卡管理</el-dropdown-item>
                                    <el-dropdown-item :command="{action:'delData',row: scope.row}">{{$t('message.common.del')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <!--<el-button type="text" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="text" @click="toNetcard(scope.row)">网卡管理</el-button>
                            <el-button type="text" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>-->
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
                        <el-form-item label="显示名称" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="主机名" prop="hostname">
                            <el-input v-model="saveForm.hostname"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="IDC" prop="idcId">
                            <el-select v-model="saveForm.idcId" style="width: 100%">
                                <el-option
                                        v-for="item in idcs"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="SSH密钥" prop="sshs">
                            <el-transfer
                                    filterable
                                    filter-placeholder="Search"
                                    v-model="saveForm.sshIds"
                                    :titles="['可配置密钥', '已配置密钥']"
                                    :data="sshs">
                                <i class="el-icon-refresh" slot="left-footer" style="cursor:pointer;margin-left: 16px" @click="getSshForSelect"></i>
                                <router-link slot="left-footer" :to="permitutil.getRoutePathByPermission('cmdb:ssh')" target="_blank" class="link" style="margin-left: 10px">前往配置</router-link>
                            </el-transfer>
                        </el-form-item>
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


        <el-dialog :close-on-click-modal="false" title="测试连接" :visible.sync="testConnectDialogVisible" width="40%" >
            <el-select v-model="testConnect.sshId" style="width: 100%">
                <el-option
                        v-for="item in sshs"
                        :key="item.key"
                        :label="item.label"
                        :value="item.key">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="testConnecting()" :loading="connecting">测试连接</el-button>
                <el-button @click="testConnectDialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" title="导入" :visible.sync="importDialogVisible" width="50%" >
            <el-form label-width="80px" size="mini" :model="importForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="IDC" prop="idcId">
                            <el-select v-model="importForm.idcId" style="width: 100%">
                                <el-option
                                        v-for="item in idcs"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <organization-selector :inputData="{organizationCode: importForm.organizationCode}" @onChangeOrganization="opt => {if(opt){importForm.organizationCode = opt}}"></organization-selector>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :offset="20" :span="4">
                        <el-button @click="downloadTemplate">生成模版</el-button>
                    </el-col>
                </el-row>
                <hr>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上传" prop="uploadData">
                            <el-upload
                                    :with-credentials="true"
                                    class="upload-demo"
                                    ref="upload"
                                    name="file"
                                    :headers="uploadHeaders"
                                    :data="uploadData"
                                    :limit="1"
                                    :auto-upload="false"
                                    :on-success="uploadSuccess"
                                    :on-error="uploadFail"
                                    :action="uploadImportFileUrl"
                                    :file-list="importForm.fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>

                    </el-col>
                </el-row>

                <el-row>
                    <el-form-item label="错误继续" prop="force">
                        <el-switch :active-value="1" :inactive-value="0" v-model="uploadData.force"></el-switch>
                    </el-form-item>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="SSH不存在则自动生成" prop="force">
                            <el-switch :active-value="1" :inactive-value="0" v-model="uploadData.sshAutoCreate"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>



            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="importHost()" :loading="uploading">执行导入</el-button>
                <el-button @click="importDialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>
    </section>
</template>


<script>
    import Host from './Host.js'

    export default Host
</script>

<style scoped>

    /*bootstrap 会覆盖该样式*/
    .upload-demo .el-upload__input {
        display: none;
    }

</style>

