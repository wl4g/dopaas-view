<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="e.g. Gitlab" style="width:150px;"></el-input>
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
            <el-button v-if="permitutil.hasPermit('uci:orchestration:edit')" type="primary" @click="addData()">+ Add&nbsp;</el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column width="100" prop="id" label="ID"></el-table-column>
                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="type" :label="$t('message.common.type')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('ci_orchestration_type',scope.row.type)">{{dictutil.getDictLabelByTypeAndValue('ci_orchestration_type',scope.row.type)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stauts" :label="$t('message.common.status')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('ci_task_type',scope.row.status)">{{dictutil.getDictLabelByTypeAndValue('ci_task_type',scope.row.status)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <!--<el-button type="warning" @click="runOrchestration(scope.row)">{{$t('message.ci.run')}}</el-button>-->
                            <el-button type="warning" @click="beforeRunTask(scope.row)">{{$t('message.ci.run')}}</el-button>
                            <el-button v-if="permitutil.hasPermit('uci:orchestration:edit')" type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="true" :title="dialogTitle" :visible.sync="dialogVisible" v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.type')" prop="type">
                            <el-select v-model="saveForm.type">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('ci_orchestration_type')"
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
                        <el-form-item :label="$t('message.common.name')" prop="environment">
                            <el-select v-model="saveForm.environment" clearable placeholder="Environment" style="width:100%;" @change="getPipelines()">
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
                    <el-col :span="24">
                        <el-form-item :label="$t('message.ci.pipeline')">
                            <template>
                                <el-table :data="saveForm.orchestrationPipelines" :border="false" style="width: 100%">
                                    <!-- 动态标签 -->
                                    <el-table-column prop="name" width="250" :label="$t('message.common.name')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.pipelineId" filterable style="width: 100%" @change="fixPipelinesShow()">
                                                <el-option
                                                        v-for="item in scope.row.showPipelines"
                                                        :key="item.id"
                                                        :label="item.pipeName"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
<!--                                    <el-table-column prop="instance" label="实例" width="50">
                                        <template slot-scope="scope">
                                            {{ getInstanceByIdCount(scope.row.pipelineId) }}
                                        </template>
                                    </el-table-column>-->
                                    <el-table-column prop="priority" :label="$t('message.ci.priority')" width="180">
                                        <template slot="header" slot-scope="scope">
                                            {{$t('message.ci.priority')}}
                                            <el-tooltip placement="top">
                                                <div slot="content">从小到大执行，优先级一样的并行执行</div>
                                                <i class="el-icon-question"></i>
                                            </el-tooltip>
                                        </template>
                                        <template slot-scope="scope">
                                            <!--<el-input  v-model="scope.row.priority"></el-input>-->
                                            <el-input-number v-model="scope.row.priority" :step="1" :max="1000" step-strictly></el-input-number>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('message.common.operation')" >
                                        <template slot-scope="scope">
                                            <el-row>
                                                <el-button @click.native.prevent="deleteRow(scope.$index)" type="danger">
                                                    Delete
                                                </el-button>
                                            </el-row>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!--</div>-->
                            <el-button type="primary"  @click.native.prevent="addRow()"> + </el-button>
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
                <el-button @click="dialogVisible = false;cleanSaveForm();">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>
        <section class=" dialogOnRightPage">
            <el-dialog :close-on-click-modal="false" title="Create Task Confirm" :visible.sync="confirmDialog" width="40%" top="0vh" custom-class="dialogOnRight">
                <el-form label-width="80px"  :model="confirmForm" ref="confirmForm" class="demo-form-inline"  :rules="buildRules">
                    <el-card class="box-card" shadow="hover" v-if="projects && projects.length >0">
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
                    <el-card class="box-card mt10" shadow="hover">
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
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="runTask()" :loading="saveLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="confirmDialog = false;cleanConfirm();">{{$t('message.common.cancel')}}</el-button>
          </span>
            </el-dialog>
        </section>
    </section>
</template>
<script>
    import Orchestration from './Orchestration.js'
    export default Orchestration
</script>

<style scoped>
</style>

