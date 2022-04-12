<template>
    <section id="configuration" class="configuration">
        <el-form label-width="100px" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
            <el-card class="box-card">
                <div slot="header">
                    <span>基础配置</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input :disabled="isEdit" v-model="saveForm.name" placeholder="e.g:sso"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item :label="$t('message.common.endpoint')" prop="endpoint">
                            <el-input v-model="saveForm.endpoint"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row>

                    <el-col :span="8">
                            <el-form-item label="运行时环境" prop="deployType">
                            <el-select v-model="saveForm.deployType" style="width: 100%">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('erm_server_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="Ssh" prop="sshId">
                            <el-select v-model="saveForm.sshId" style="width: 100%" filterable>
                                <el-option
                                        v-for="item in sshs"
                                        :key="item.id"
                                        :label="item.name+'  ('+item.username+')'"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="16">
                        <el-form-item :label="$t('message.common.remark')" prop="remark">
                            <el-input type="textarea" v-model="saveForm.remark" placeholder="remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <organization-selector :inputData="{organizationCode: saveForm.organizationCode}" @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
                    </el-col>
                </el-row>
            </el-card>

            <el-card class="box-card">
                <div slot="header">
                    <span>环境配置</span>
                </div>
                <el-tabs tab-position="left" >
                    <el-tab-pane v-for="item in saveForm.environments" :label="dictutil.getDictLabelByTypeAndValue('app_ns_type',item.envType)">
                        <el-row>
                            <el-col :span="5">
                                <el-form-item label="启用">
                                    <el-switch v-model="item.enable" :active-value="1" :inactive-value="0"/>
                                </el-form-item>
                            </el-col>
                            <el-col :offset="2" :span="15">
                                <el-button type="text" @click="toInstancesPage(item.envType)">管理实例</el-button>
                                <el-button type="text" >启动</el-button>
                                <el-button type="text" >停止</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="15">
                                <el-form-item label="运行命令">
                                    <el-input type="textarea" :rows="3" v-model="item.runCommand" placeholder="Run command e.g: /etc/init.d/ems.service restart"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="saveForm.deployType==2||saveForm.deployType==3">
                            <el-col :span="15">
                                <el-form-item label="策略配置">
                                    <el-input type="textarea" :rows="5" v-model="item.configContent" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row v-if="saveForm.deployType==2||saveForm.deployType==3">
                            <el-col :span="7">
                                <el-form-item label="镜像仓库" prop="dockerRepository">
                                    <el-select v-model="item.repositoryId" style="width: 100%">
                                        <el-option
                                                v-for="item in dockerRepositorys"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                        <el-option label="自定义" :value="-1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8" v-if="item.repositoryId==-1">
                                <el-form-item label="仓库地址">
                                    <el-input v-model="item.dockerRepository.registryAddress" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="item.repositoryId==-1">
                            <el-col :span="7">
                                <el-form-item label="用户名">
                                    <el-input v-model="item.dockerRepository.authConfigModel.username" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="密码">
                                    <el-input type="password" v-model="item.dockerRepository.authConfigModel.password" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row v-if="saveForm.deployType==2||saveForm.deployType==3">
                            <el-col :span="7">
                                <el-form-item label="仓库命名空间" prop="repositoryNamespace">
                                    <el-autocomplete
                                            v-model="item.repositoryNamespace"
                                            value-key="name"
                                            :fetch-suggestions="((name, cb)=>{getRepositoryProjects(item.repositoryId, item.dockerRepository.registryAddress,name,cb)})"
                                            placeholder="请输入内容"
                                    ></el-autocomplete>
                                </el-form-item>

                            </el-col>
                        </el-row>

                    </el-tab-pane>
                </el-tabs>
            </el-card>



        </el-form>
        <el-row>
            <el-col :span="4" :offset="20">
                <el-button type="primary" @click="saveData()" :loading="loading">{{$t('message.common.save')}}</el-button>
                <el-button @click="back()">{{$t('message.common.cancel')}}</el-button>
            </el-col>
        </el-row>



    </section>
</template>


<script>
    import ClusterEdit from './ClusterEdit.js'

    export default ClusterEdit
</script>

<style>
    .my-table-textarea textarea{
        overflow:hidden;
        resize:none;
        height: 29px !important;
        min-height: 29px !important;
    }

</style>
