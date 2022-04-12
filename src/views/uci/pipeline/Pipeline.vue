<template>
    <section id="configuration" class="configuration dialogOnRightPage">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.ci.pipeName')">
                <el-input v-model="searchParams.pipeName" placeholder="e.g. sso" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.ci.pipeKind')">
                <el-select clearable v-model="searchParams.providerKind" placeholder="PipeKind" style="width:105px;">
                    <el-option
                            v-for="item in dictutil.getDictListByType('ci_provider_kind')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.enable!=1">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.ci.env')">
                <el-select v-model="searchParams.environment" clearable placeholder="Env Type" style="width:105px;">
                    <el-option
                            v-for="item in dictutil.getDictListByType('app_ns_type')"
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
                {{$t('message.common.total')}}： <span class="number">{{total}}</span>
            </div>

            <el-dropdown @command="add" :show-timeout="0" :hide-timeout="0">
                <el-button type="primary">+ New Pipeline</el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                            v-for="item in dictutil.getDictListByType('ci_provider_kind')"
                            :command="item.value"
                            :disabled="item.enable!=1">
                        {{item.label}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width: 100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column prop="id" label="ID" min-width="40"></el-table-column>-->
                    <el-table-column prop="pipeName" :label="$t('message.ci.pipeName')" min-width="130"></el-table-column>
                    <el-table-column prop="clusterName" :label="$t('message.ci.cluster')" min-width="100"></el-table-column>
                    <el-table-column prop="instances" :label="$t('message.ci.instances')" width="60">
                        <template slot-scope="scope">
                            <el-popover placement="right" width="200" trigger="hover">
                                <el-input type="textarea" :rows="3" placeholder="No data row" :readonly="true" :value="instances2Str(scope.row)"></el-input>
                                <el-button slot="reference">{{countInstance(scope.row)}}</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="branchs" label="分支/标签" width="80">
                        <template slot-scope="scope">
                            <el-popover placement="right" width="300" trigger="hover">
                                <el-input type="textarea" :rows="3" placeholder="No data row" :readonly="true" :value="branchs2Str(scope.row)"></el-input>
                                <el-button slot="reference">{{countProject(scope.row)}}</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="envType" :label="$t('message.ci.env')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('app_ns_type',scope.row.environment)">{{dictutil.getDictLabelByTypeAndValue('app_ns_type',scope.row.environment)}}</el-tag>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="branchName" :label="$t('message.ci.branchName')" min-width="58"></el-table-column>-->
                    <el-table-column prop="providerKind" :label="$t('message.ci.pipeKind')" ></el-table-column>
                    <el-table-column prop="createDate" :label="$t('message.common.createDate')" min-width="130"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" width="230">
                        <template slot-scope="scope">
                            <el-button type="warning" @click="beforeRunTask(scope.row)">{{$t('message.ci.build')}}</el-button>
                            <el-button v-if="permitutil.hasPermit('uci:pipeline:edit')" type="info" icon='edit' @click="taskDetail(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delTask(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :current-page="currentPage"  :total="total" @current-change='currentChange'></el-pagination>


        <right-panel :show="confirmDialog" @close="confirmDialog = false">
            <!--<el-dialog :close-on-click-modal="false" :title="confirmDialogTitle" :visible.sync="confirmDialog" width="50%" top="0vh" custom-class="dialogOnRight" :append-to-body="false">-->
            <el-form label-width="80px"  :model="confirmForm" ref="confirmForm" class="demo-form-inline" :rules="buildRules">

                <el-card class="box-card" shadow="hover" v-if="confirmForm.pcmEnable===1" :body-style="{padding: '10px'}">
                    <div slot="header" class="clearfix">
                        <span>任务工单信息(请选择上游项目协作系统的任务指派工单信息):</span>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="$t('message.ci.trackType')" prop="trackType">
                                <el-select v-model="confirmForm.trackType">
                                    <el-option
                                            v-for="item in dictutil.getDictListByType('ci_track_type')"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('message.ci.project')" prop="projectId">
                                <el-select v-model="confirmForm.projectId" @change="getIssues">
                                    <el-option
                                            v-for="item in projects"
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
                            <el-form-item :label="$t('message.common.username')" prop="userId" >
                                <el-select v-model="confirmForm.userId" @change="getIssues">
                                    <el-option
                                            v-for="item in users"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('message.ci.issue')" prop="trackId">
                                <el-select v-model="confirmForm.trackId">
                                    <el-option
                                            v-for="item in issues"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-card>
                <el-card class="box-card mt10" shadow="hover" :body-style="{padding: '10px'}">
                    <div slot="header" class="clearfix">
                        <span>测试报告信息:</span>
                    </div>
                    <el-row>
                        <el-form-item label="File" prop="file">
                            <el-col :span="18">
                                <el-input v-model="confirmForm.annex" disabled></el-input>
                            </el-col>
                            <el-col :offset="1" :span="5">
                                <el-upload
                                        :with-credentials="true"
                                        name="file"
                                        class="upload-demo"
                                        :limit="1"
                                        :on-success="uploadSuccess"
                                        :on-error="uploadFail"
                                        :action="uploadUrl"
                                        :file-list="confirmForm.fileList">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                </el-upload>
                            </el-col>
                        </el-form-item>
                    </el-row>
                </el-card>

                <el-card class="box-card mt10" shadow="hover" :body-style="{padding: '10px'}">
                    <div slot="header" class="clearfix">
                        <span>其他:</span>
                    </div>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item :label="$t('message.common.remark')" prop="remark">
                                <el-input type="textarea" v-model="confirmForm.remark" :rows="2"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>



            </el-form>

            <!--<el-upload
                    class="upload-demo"
                    :with-credentials="true"
                    name="file"
                    ref="upload"
                    action="http://wl4g.debug:14046/ci-server/task/upload"
                    :file-list="confirmForm.fileList"
                    :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>-->

            <!--<span slot="footer" class="dialog-footer">-->
                <el-button type="primary" @click="runTask()" :loading="saveLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="confirmDialog = false;">{{$t('message.common.cancel')}}</el-button>
          <!--</span>-->
        </right-panel>

    </section>
</template>
<script>
    import Pipeline from './Pipeline.js'
    export default Pipeline
</script>
<style>
    /*bootstrap 会覆盖该样式*/
    .upload-demo .el-upload__input {
        display: none;
    }
    /*.el-upload-list {
        display: none;
    }*/
    .mt10 {
        margin-top: 10px;
    }

</style>
