<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item label="ID:">
                <el-input v-model="searchParams.id" placeholder="e.g. 1" style="width:80px"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="e.g. TaskPortalDev"></el-input>
            </el-form-item> -->
            <el-form-item :label="$t('message.ci.pipeId')">
                <el-input v-model="searchParams.taskId" placeholder="e.g. TaskPortalDev" style="width:155px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.common.enable')">
                <el-select clearable v-model="searchParams.enable" style="width:100px">
                    <el-option label="Enable" value="1"></el-option>
                    <el-option label="Disable" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.common.createDate')">
                <el-date-picker v-model="searchParams.startDate" type="date" placeholder="Start Date" format="yyyy-MM-dd HH:mm" style="width:160px"></el-date-picker>
                <el-date-picker v-model="searchParams.endDate" type="date" placeholder="End Date" format="yyyy-MM-dd HH:mm" style="width:160px"></el-date-picker>
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
            <el-button type="primary" @click="addTrigger()">+ Task Schedule </el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width: 100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column prop="id" label="ID"></el-table-column>-->

                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="taskId" :label="$t('message.ci.pipeId')"></el-table-column>

                    <el-table-column prop="type" :label="$t('message.common.type')">
                        <template slot-scope="scope">
                            {{convertType(scope.row)}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="enable" :label="$t('message.common.enable')">
                        <template slot-scope="scope">
                            <el-tag :type="convertEnableType(scope.row)">{{convertEnableValue(scope.row)}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createDate" :label="$t('message.common.createDate')"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="editTrigger(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delTrigger(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" width="60%" v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" :rules="rules"
                     class="demo-form-inline">

                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.cluster')" prop="cluster">
                            <el-col :span="20">
                                <el-select v-model="saveForm.group" @change="getPipesByAppClusterId()" placeholder="Please Cluster" style="width: 100%;">
                                    <el-option
                                            v-for="item in groupData"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="4" class="text-center">
                                <i class="el-icon-refresh" @click="getGroup"></i>
                                <a @click="gotoCluster" class="link">前往配置</a>
                            </el-col>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.pipeId')" prop="taskId">
                            <el-select v-model="saveForm.taskId" placeholder="Please Task" style="width: 100%;">
                                <el-option
                                        v-for="item in tasksData"
                                        :key="item.id"
                                        :label="item.pipeName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.type')" prop="type">
                            <el-select v-model="saveForm.type" placeholder="类型" style="width: 100%;">
                                <el-option label="Scheduler" :value="4"></el-option>
                                <el-option label="Hook" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.ci.cron')" prop="cron" v-if="saveForm.type==4">
                            <!--<el-input  v-model="saveForm.cron" placeholder="时间表达式" @change="checkCron"></el-input>-->
                            <el-popover placement="right" width="200" trigger="focus" title="Last 5 run times:">
                                <el-input type="textarea" :rows="10" :readonly="true" v-model="checkResult"></el-input>
                                <el-input slot="reference" v-model="saveForm.cron" placeholder="e.g. 0/5 30 * * * ?" @change="checkCron"></el-input>
                            </el-popover>

                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name" placeholder="name"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.enable')" prop="enable">
                            <el-switch v-model="saveForm.enable" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item :label="$t('message.common.remark')" prop="remark">
                    <el-input v-model="saveForm.remark" placeholder="备注"></el-input>
                </el-form-item>

                <el-row>
                    <el-col :span="24">
                        <organization-selector :inputData="{organizationCode: saveForm.organizationCode}" @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveTrigger()" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
          </span>
        </el-dialog>


    </section>
</template>


<script>
    import Trigger from './Trigger.js'

    export default Trigger
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
