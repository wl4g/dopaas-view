<template>
    <section id="configuration" class="configuration">

        <el-button type="primary" @click="backToChanges" style='float:right;margin-right:20px'>{{$t('message.common.back')}}</el-button>
        <el-button type="primary" @click="reload" style='float:right;margin-right:20px'>重新加载</el-button>
        <el-button :type="logReadRunning?'danger':'success' " @click="changeLogReadRunning" style='float:right;margin-right:20px'>{{ logReadRunning?'Stop':'Start' }}</el-button>

        <el-form :inline="true" label-width="80px" class="demo-form-inline">
            <el-form-item :label="$t('message.ci.cluster')">
                <el-input v-model="detailForm.clusterName" disabled></el-input>
            </el-form-item>
            <el-form-item label="通道名">
                <el-input v-model="detailForm.pipeName" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="detailForm.annex" :label="$t('message.ci.annex')">
                <a :href="detailForm.annex">
                    <el-button>{{$t('message.common.download')}}</el-button>
                </a>
            </el-form-item>
            <div>
                <el-table :data="detailForm.pipelineHistoryInstances" :border="false" style="width: 100%">
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="instanceId" :label="$t('message.ci.instances')+'Id'"></el-table-column>
                    <el-table-column prop="instanceName" :label="$t('message.ci.instances')"></el-table-column>
                    <el-table-column prop="status" :label="$t('message.common.status')">
                        <template slot-scope="scope">
                            <el-tag :color="convertStatusType(scope.row)">
                                <img v-bind:src="convertStatusValue(scope.row)['img']"/>
                                {{convertStatusValue(scope.row)['text']}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="result" :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <!--<el-popover placement="right" width="400" trigger="click">
                                <el-input type="textarea" :rows="30" placeholder="暂无数据" class="mytextarea" :readonly="true"
                                          v-model="scope.row.result"></el-input>
                                <el-button slot="reference">{{$t('message.common.detail')}}</el-button>
                            </el-popover>-->
                            <el-button type="info" size="small" :disabled="scope.row.status === 0" @click="openDetail(scope.row)">{{$t('message.common.detail')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
        <div id="myterminal" style="height: 400px"></div>

        <!--================================detail================================-->
        <el-dialog :title="title" :close-on-click-modal="false" size="large" :visible.sync="detailVisible" width="60%" @close="destoryReadLogDetailTask" v-loading='dialogLoading'>
            <el-form>
                <div id="detailTerminal"></div>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="detailVisible = false;">Close</el-button>
            </span>
        </el-dialog>

    </section>
</template>


<script>
    import PipeHisDetail from './PipeHisDetail.js'

    export default PipeHisDetail
</script>


