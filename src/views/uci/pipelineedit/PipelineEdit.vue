<template>

    <section id="pipe_edit_page" ref="pipe_edit_page" class="configuration">
        <el-form label-width="135px" :model="saveForm" ref="saveForm" :rules="rules">

            <!--====================基础信息start====================-->
            <el-card class="box-card" style="background: rgba(243,241,237,0.32); width: 90%" id="pipe_step1" shadow="hover">
                <div slot="header">
                    <span class="pipe-step-title">基础信息</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('message.ci.pipeName')" prop="pipeName">
                            <el-input v-model="saveForm.pipeName" placeholder="Pipeline Name" style="width: 100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.cluster')" prop="clusterId">
                            <el-col :span="12">
                                <el-select v-model="saveForm.clusterId" @change="onChangeCluster" :disabled="isEdit" filterable style="width: 100%">
                                    <el-option
                                            v-for="item in clusterData"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6" class="text-center">
                                <i class="el-icon-refresh" style="cursor:pointer;" @click="refreshClusterData"></i>
                                <router-link :to="permitutil.getRoutePathByPermission('cmdb:cluster')" target="_blank" class="link">前往配置</router-link>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <organization-selector :inputData="{organizationCode: saveForm.organizationCode}"
                                               @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
                    </el-col>
                </el-row>

            </el-card>
            <!--====================基础信息end====================-->


            <!--====================分支信息start====================-->
            <el-card class="box-card" id="pipe_step2" style="width: 90%" shadow="hover">
                <div slot="header">
                    <span class="pipe-step-title">源码配置</span>
                </div>
                <el-row>
                    <el-col :span="11">
                        <el-form-item :label="$t('message.ci.branchType')">
                            <el-switch v-model="saveForm.pipeStepBuilding.refType" @change="getPipeStepBuilding"
                                       :active-value="2" :inactive-value="1"
                                       active-text="tag" inactive-text="branch"
                                       active-color="#20A0FF" inactive-color="#13CE66">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item :label="$t('message.ci.commands')">
                            <template>
                                <el-col :span="23">
                                    <el-table :data="saveForm.pipeStepBuilding.pipeStepBuildingProjects" style="width: 100%" :border="false">
                                        <el-table-column label="Id" min-width="10">
                                            <template slot-scope="scope">
                                                {{scope.row.projectId}}
                                            </template>
                                        </el-table-column>

                                        <el-table-column :label="$t('message.ci.project')" min-width="30">
                                            <template slot-scope="scope">
                                                {{scope.row.projectName}}
                                            </template>
                                        </el-table-column>

                                        <el-table-column :label="$t('message.ci.branchName')" min-width="30">
                                            <template slot-scope="scope">
                                                <el-select filterable v-model="scope.row.ref" placeholder="branch" style="width: 100%;">
                                                    <el-option
                                                            v-for="item in scope.row.branchs"
                                                            :key="item"
                                                            :label="item"
                                                            :value="item">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>

                                        <el-table-column :label="$t('message.ci.commands')" min-width="120">
                                            <template slot-scope="scope">
                                                <!--<el-input  v-model="scope.row.command"></el-input>-->
                                                <el-input type="textarea" style="width: 100%" v-model="scope.row.buildCommand" :rows="2"></el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <el-col :span="1">
                                    <i class="el-icon-refresh" style="cursor:pointer;" @click="getPipeStepBuilding"></i>
                                </el-col>
                            </template>
                            <!--<el-button type="primary"  @click.native.prevent="addRow()">+</el-button>-->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="编译前置命令" prop="preCommand">
                            <el-input type="textarea" v-model="saveForm.pipeStepBuilding.preCommand" :rows="3" placeholder="暂无数据"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip placement="top">
                            <div slot="content">在编译前执行</div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="编译后置命令" prop="postCommand">
                            <el-input type="textarea" v-model="saveForm.pipeStepBuilding.postCommand" :rows="3" placeholder="暂无数据"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip placement="top">
                            <div slot="content">在编译后执行</div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-col>
                </el-row>


            </el-card>
            <!--====================分支信息end====================-->


            <el-card class="box-card" id="pipe_step3" style="width: 90%" shadow="hover">
                <div slot="header">
                    <span class="pipe-step-title">构建配置</span>
                </div>
                <!--====================Test start====================-->
                <el-card class="box-card">
                    <div slot="header">
                        <span class="pipe-step-title">测试</span>
                        <el-switch style="padding: 3px 0" v-model="saveForm.testOnOff"></el-switch>
                    </div>
                </el-card>
                <!--====================Test end====================-->

                <!--====================Analysis start====================-->
                <el-card class="box-card">
                    <div slot="header">
                        <span class="pipe-step-title">分析</span>
                        <el-switch style="padding: 3px 0" v-model="saveForm.analysisOnOff"></el-switch>
                    </div>
                </el-card>
                <!--====================Analysis end====================-->
            </el-card>


            <el-card class="box-card" id="pipe_step4" style="width: 90%" shadow="hover">
                <div slot="header">
                    <span class="pipe-step-title">部署配置</span>
                </div>

                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('message.ci.env')" prop="environment">
                            <el-select v-model="saveForm.environment" @change="getinstance()" placeholder="Environment" style="width: 100%">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('app_ns_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>


                <el-row>
                    <el-form-item :label="$t('message.ci.assetsPath')" prop="assetsDir">
                        <el-col :span="20">
                            <el-input placeholder="tar path e.g: /portal-start/target" v-model="saveForm.assetsDir">
                                <template slot="prepend">{{'{WORKSPACE}/sources/'+saveForm.projectName}}</template>
                                <template slot="append">{{saveForm.assetsPath3}}</template>
                            </el-input>
                        </el-col>
                        <el-col :span="1">
                            <el-tooltip placement="top">
                                <div slot="content">
                                    打包好后的tar包存放位置<br>
                                    maven项目参考一下配置:
                                    <pre>
&lt;plugin&gt;
    &lt;artifactId&gt;maven-assembly-plugin&lt;/artifactId&gt;
    &lt;configuration&gt;
        &lt;finalName&gt;${final.name}-${project.version}-bin&lt;/finalName&gt;
        &lt;appendAssemblyId&gt;false&lt;/appendAssemblyId&gt;
        &lt;descriptors&gt;
            &lt;descriptor&gt;src/main/assemble/package.xml&lt;/descriptor&gt;
        &lt;/descriptors&gt;
    &lt;/configuration&gt;
    &lt;executions&gt;
        &lt;execution&gt;
            &lt;id&gt;make-assembly&lt;/id&gt;
            &lt;phase&gt;package&lt;/phase&gt;
            &lt;goals&gt;
                &lt;goal&gt;single&lt;/goal&gt;
            &lt;/goals&gt;
        &lt;/execution&gt;
    &lt;/executions&gt;
&lt;/plugin&gt;
                                </pre>
                                </div>
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-col>
                    </el-form-item>
                </el-row>

                <el-row>
                    <el-form-item :label="$t('message.ci.appInstallHome')" prop="parentAppHome">
                        <el-col :span="16">
                            <el-input v-model="saveForm.parentAppHome" placeholder="install directory"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>

                <!--====================Instance start====================-->
                <el-card class="box-card">
                    <div slot="header">
                        <span class="pipe-step-title">实例</span>
                        <el-switch style="padding: 3px 0" :active-value="1" :inactive-value="0" v-model="saveForm.instanceOnOff"></el-switch>
                    </div>
                    <el-row v-if="saveForm.instanceOnOff===1">
                        <el-col :span="24">
                            <el-form-item :label="$t('message.ci.instances')" prop="instanceIds">
                                <el-transfer
                                        filterable
                                        filter-placeholder="Search"
                                        :titles="['可选节点', '已选节点']"
                                        v-model="saveForm.instanceIds"
                                        :data="instanceData2">
                                    <i class="el-icon-refresh" slot="left-footer" style="cursor:pointer;margin-left: 16px" @click="refreshInstanceData"></i>
                                    <router-link slot="left-footer" :to="permitutil.getRoutePathByPermission('cmdb:instance')" target="_blank" class="link" style="margin-left: 10px">前往配置</router-link>
                                </el-transfer>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
                <!--====================Instance end====================-->

                <!--====================自定义命令start====================-->
                <el-card class="box-card" style="background: rgba(243,241,237,0.32);">
                    <div slot="header">
                        <span class="pipe-step-title">远程命令</span>
                        <el-switch style="padding: 3px 0" :active-value="1" :inactive-value="0" v-model="saveForm.pipeStepInstanceCommand.enable"></el-switch>
                    </div>
                    <div v-if="saveForm.pipeStepInstanceCommand.enable===1">
                        <el-row>
                            <el-col :span="22">
                                <el-form-item :label="$t('message.ci.preCommand')" prop="preCommand">
                                    <el-input type="textarea" v-model="saveForm.pipeStepInstanceCommand.preCommand" :rows="3" placeholder="暂无数据"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-tooltip placement="top">
                                    <div slot="content">前置命令，编译完成后，在远程目标机器(instance)执行，在deploy前执行</div>
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="22">
                                <el-form-item :label="$t('message.ci.postCommand')" prop="postCommand">
                                    <el-input type="textarea" v-model="saveForm.pipeStepInstanceCommand.postCommand" :rows="3" placeholder="暂无数据"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-tooltip placement="top">
                                    <div slot="content">后置命令，deploy后执行，在远程目标机器(instance)执行，可以是应用的重启命令,e.g: /etc/init.d/iam-web restart</div>
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <!--====================自定义命令end====================-->

                <!--====================Docker start====================-->
                <!--<el-card class="box-card">
                    <div slot="header">
                        <span>Docker</span>
                        <el-switch style="padding: 3px 0" v-model="saveForm.dockerOnOff"></el-switch>
                    </div>
                    <div v-if="saveForm.dockerOnOff">

                    </div>
                </el-card>-->
                <!--====================Docker end====================-->
            </el-card>

            <!--====================PCM start====================-->
            <el-card class="box-card" id="pipe_step5" style="width: 90%" shadow="hover">
                <div slot="header">
                    <span class="pipe-step-title">扩展配置</span>
                    <el-switch style="padding: 3px 0" :active-value="1" :inactive-value="0" v-model="saveForm.pipeStepPcm.enable"></el-switch>
                </div>
                <div v-if="saveForm.pipeStepPcm.enable===1">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="Pcm:" prop="pcmId">
                                <el-select v-model="saveForm.pipeStepPcm.pcmId" style="width: 60%" @change="onChangePcm">
                                    <el-option
                                            v-for="item in pcmData"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                                <i class="el-icon-refresh" style="cursor:pointer;" @click="refreshPcmtData"></i>
                                <router-link :to="permitutil.getRoutePathByPermission('uci:pcm')" target="_blank" class="link">前往配置</router-link>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="项目:" prop="xProjectId">
                                <el-select v-model="saveForm.pipeStepPcm.xProjectId" style="width: 100%">
                                    <el-option
                                            v-for="item in pcmProjects"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="跟踪:" prop="xTracker">
                                <el-select v-model="saveForm.pipeStepPcm.xTracker" style="width: 100%">
                                    <el-option
                                            v-for="item in pcmTrackers"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="状态:" prop="xStatus">
                                <el-select v-model="saveForm.pipeStepPcm.xStatus" style="width: 100%">
                                    <el-option
                                            v-for="item in pcmStatuses"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="优先级:" prop="xPriority">
                                <el-select v-model="saveForm.pipeStepPcm.xPriority" style="width: 100%">
                                    <el-option
                                            v-for="item in pcmPriorities"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <!--====================PCM end====================-->

            <!--====================通知start====================-->
            <el-card class="box-card" id="pipe_step6" style="width: 90%" shadow="hover">
                <div slot="header">
                    <span class="pipe-step-title">通知配置</span>
                    <el-switch style="padding: 3px 0" :active-value="1" :inactive-value="0" v-model="saveForm.pipeStepNotification.enable"></el-switch>
                </div>
                <el-row v-if="saveForm.pipeStepNotification.enable===1">
                    <el-col :span="16">
                        <el-form-item :label="$t('message.ci.contactGroup')" prop="contactGroupData">
                            <el-select v-model="saveForm.pipeStepNotification.contactGroupId" multiple placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in contactGroupData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>


          <!--====================API 配置 start====================-->
          <el-card class="box-card" id="pipe_step7" style="width: 90%" shadow="hover">
            <div slot="header">
              <span class="pipe-step-title">文档构建配置</span>
              <el-switch style="padding: 3px 0" :active-value="1" :inactive-value="0" v-model="saveForm.pipeStepNotification.enable"></el-switch>
            </div>
            <el-row v-if="saveForm.pipeStepNotification.enable===1">
              <el-col :span="7">
                <el-form-item label="仓库" prop="repositoryId">
                  <el-select v-model="saveForm.pipeStepApi.repositoryId" @change="changeRepository" placeholder="请选择" style="width: 100%">
                    <el-option
                        v-for="item in apiRepositorys"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>
<!--              <el-col :span="7">
                <el-form-item label="版本" prop="versionId">
                  <el-select v-model="saveForm.pipeStepApi.versionId" @change="changeVersion" placeholder="请选择" style="width: 100%">
                    <el-option
                        v-for="item in apiVersions"
                        :key="item.id"
                        :label="item.version"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="模块" prop="moduleId">
                  <el-select v-model="saveForm.pipeStepApi.moduleId" placeholder="请选择" style="width: 100%">
                    <el-option
                        v-for="item in apiModules"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->

            </el-row>
          </el-card>

            <el-row>
                <el-col :span="4" :offset="20">
                    <el-button type="primary" @click="save()" :loading="loading">{{$t('message.common.save')}}</el-button>
                    <el-button @click="backToTask()">{{$t('message.common.cancel')}}</el-button>
                </el-col>
            </el-row>
        </el-form>

        <el-dialog :close-on-click-modal="false" title="Info" :visible.sync="gotoProjectSettingDialog" width="30%">
            未找到该cluster对应的工程依赖，请设置
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="gotoProjectSetting">立即前往设置</el-button>
            </span>
        </el-dialog>


        <!--<div id="onRigthStep" style="width: 100px;height: 100px;background-color: #0b86f3"></div>-->

        <div class="onRigthStep" style="height: 400px;">
            <el-steps direction="vertical" :active="activeStep" :align-center="true" finish-status="success" process-status="success">
                <el-step title="基础信息" style="cursor:pointer" @click.native="clickStep(1)"></el-step>
                <el-step title="源码配置" style="cursor:pointer" @click.native="clickStep(2)"></el-step>
                <el-step title="构建配置" style="cursor:pointer" @click.native="clickStep(3)"></el-step>
                <el-step title="部署配置" style="cursor:pointer" @click.native="clickStep(4)"></el-step>
                <el-step title="扩展配置" style="cursor:pointer" @click.native="clickStep(5)"></el-step>
                <el-step title="通知配置" style="cursor:pointer" @click.native="clickStep(6)"></el-step>
            </el-steps>
        </div>

    </section>
</template>


<script>
    import PipelineEdit from './PipelineEdit.js'

    export default PipelineEdit
</script>

<style>

    .onRigthStep {
        position: fixed;
        float:right;
        right: 30px;
        top: 30%;
    }

    .pipe-step-title{
        font-size: 14px;
        font-weight: 600;
    }

    .onRigthStep .el-step__title{
        font-size: 14px;
    }

    .box-card {
        margin: 10px 0px 10px 0px;
    }

    .el-card__body {
        padding: 5px 0px 5px 0px;
    }

    .el-card__header {
        padding: 10px 20px;
        border-bottom: 1px solid #EBEEF5;
    }

    .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
        font-size: 14px;
    }

</style>
