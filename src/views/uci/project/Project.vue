<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">

            <el-form-item :label="$t('message.ci.cluster')">
                <el-input v-model="searchParams.groupName" placeholder="e.g. sso | portal"></el-input>
            </el-form-item>

            <el-form-item :label="$t('message.ci.project')">
                <el-input v-model="searchParams.projectName" placeholder="e.g. safecloud-web-portal"></el-input>
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
                {{$t('message.common.total')}}： <span class="number">{{total}}</span>
            </div>
            <!-- 新增按钮 -->
            <el-button v-if="permitutil.hasPermit('uci:project:edit')" type="primary" @click="addPriject()" >+ New Project</el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width: 100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
                    <el-table-column prop="groupName" :label="$t('message.ci.cluster')"></el-table-column>
                    <el-table-column prop="projectName" :label="$t('message.ci.project')"></el-table-column>
                    <!--<el-table-column prop="httpUrl" :label="$t('message.ci.httpUrl')" :show-overflow-tooltip="true"></el-table-column>-->
                    <el-table-column prop="createDate" :label="$t('message.common.createDate')"></el-table-column>

                    <!--<el-table-column prop="lockStatus" label="LockStatus" :formatter="convertLockStatus"></el-table-column>-->
                    <el-table-column prop="lockStatus" :label="$t('message.ci.lockStatus')" :formatter="convertLockStatus">
                        <template slot-scope="scope">
                            <el-button :disabled="convertLockStatusDisable(scope.row)" @click="unlock(scope.row)">{{convertLockStatus(scope.row)}}</el-button>
                        </template>

                    </el-table-column>

                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button v-if="permitutil.hasPermit('uci:project:edit')" type="info" icon='edit' @click="editPriject(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delProject(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" width="60%" :title="dialogTitle" :visible.sync="dialogVisible" v-loading='dialogLoading'>
            <el-form label-width="100px"  :rules="rules" :model="saveForm" ref="saveForm"
                     class="demo-form-inline">

                <el-form-item :label="$t('message.ci.isBoot')" prop="isBoot">
                    <el-switch v-model="saveForm.isBoot"
                               :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>

                <el-row v-if="saveForm.isBoot===1">
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.cluster')" prop="appClusterId">
                            <el-col :span="16">
                                <el-select v-model="saveForm.appClusterId" placeholder="Please group" filterable>
                                    <el-option
                                            v-for="item in groupData"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8" class="text-center">
                                <i class="el-icon-refresh" @click="getGroup"></i>
                                <router-link :to="permitutil.getRoutePathByPermission('cmdb:cluster')" target="_blank" class="link">前往配置</router-link>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-col :span="18">
                        <el-form-item :label="$t('message.ci.vcsProvider')" prop="vcs">
                            <el-select v-model="saveForm.vcsId" @change="changeVcs">
                                <el-option
                                        v-for="item in vcsData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                        <el-col :span="6" class="text-center">
                            <i class="el-icon-refresh" @click="getVcs"></i>
                            <router-link :to="permitutil.getRoutePathByPermission('urm:repository')" target="_blank" class="link">前往配置</router-link>
                        </el-col>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.project')" prop="project">
                            <el-col :span="22">
                                <el-select
                                        v-model="saveForm.projectName"
                                        @change="changeProject"
                                        filterable
                                        remote
                                        :clearable="true"
                                        :placeholder="$t('message.common.searchInput')"
                                        :remote-method="remoteMethod"
                                        :loading="searchProjectLoading" style="width: 100%">
                                    <el-option
                                            v-for="item in vcsProjectData"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.name">
                                        <span style="float: left">{{ item.name }}&nbsp;&nbsp;&nbsp;</span>
                                        <span style="float: right; color: #8492a6; font-size: 12px">({{ item.pathWithNamespace }})</span>
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="1">
                                <el-tooltip placement="top">
                                    <div slot="content">该数据从provider实时远程获取</div>
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="$t('message.ci.httpUrl')" prop="httpUrl">
                    <el-input v-model="saveForm.httpUrl" placeholder="http url" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item :label="$t('message.ci.sshUrl')" prop="sshUrl">
                    <el-input v-model="saveForm.sshUrl" placeholder="ssh url" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item :label="$t('message.common.remark')" prop="remark">
                    <el-input v-model="saveForm.remark" placeholder="desciption"></el-input>
                </el-form-item>

                <el-row>
                    <el-col :span="23">
                        <el-form-item :label="$t('message.ci.dependencies')" prop="dependencies">
                            <!-- 查询结果表格 -->
                            <!--<div style="float:left;width: 266%;" v-loading='dialogLoading'>-->
                            <template>
                                <el-table :data="saveForm.dependencies" style="width: 100%" :border="false">
                                    <!-- 动态标签 -->
                                    <el-table-column prop="dependentId" :label="$t('message.ci.dependent')" min-width="290">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.dependentId"  placeholder="project" >
                                                <el-option
                                                        v-for="item in ProjectData"
                                                        :key="item.id"
                                                        :label="item.projectName"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.common.operation')" min-width="140">
                                        <template slot-scope="scope">
                                            <el-row>
                                                <el-button @click.native.prevent="deleteDep(scope.$index)" type="text" size="mini" style="float: left;line-height: 20px;">
                                                    {{$t('message.common.del')}}
                                                </el-button>
                                            </el-row>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!--</div>-->
                            <el-button type="primary"  @click.native.prevent="addRow()">+ Add Dependency</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip placement="top">
                            <div slot="content">只用配直接依赖，间接依赖可以不用配</div>
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="24">
                        <organization-selector :inputData="{organizationCode: saveForm.organizationCode}" @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveProject()"  :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
          </span>
        </el-dialog>


    </section>
</template>


<script>
    import Project from './Project.js'

    export default Project
</script>

<style scoped>

    .mytextarea {
        height: 70vh;
        overflow-y: auto;
    }

    .mytextarea .el-textarea__inner {
        height: 100%;
        color: #aaa;
        background-color: #333;
        padding: 10px 10px 40px 10px;
        /* color: #bbb; */
        /* cursor: not-allowed; */
    }


</style>
