<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" class="searchbar" :model="searchParams"  @keyup.enter.native="onSubmit()">

            <el-form-item label="RunId">
                <el-input v-model="searchParams.runId" placeholder=""></el-input>
            </el-form-item>
          <input hidden></input>

            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>
            <el-form-item style='float:right'>

            </el-form-item>
        </el-form>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <div class="query">
            <div class="query-left">
                <div class="line"></div>
                {{$t('message.common.total')}}： <span class="number">{{total}}</span>
            </div>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>

                <el-table :data="tableData" :border="false" style="width:100%" row-key="id"  :stripe="true" :expand-row-keys="expandRowKeys">
                    <el-table-column type="expand" width="50">
                        <template slot-scope="{row}">
                            <el-table :data="row.taskHistories" style="width:100%"  header-cell-class-name="expand-table-cell" :border="false">
                                <!--<el-table-column width="80" prop="id" label="ID" ></el-table-column>-->
                                <el-table-column width="50"></el-table-column>
                                <el-table-column width="80" prop="clusterName" :label="$t('message.ci.cluster')"></el-table-column>
                                <el-table-column width="160" prop="pipeName" label="管道名"></el-table-column>
                                <el-table-column prop="status" :label="$t('message.common.status')" width="120">
                                    <template slot-scope="scope">
                                        <el-tag  :color="convertStatusType(scope.row)" style="color: #ffffffeb;border: 1px solid #99bce0;">
                                            <img v-bind:src="convertStatusValue(scope.row)['img']" />
                                            {{convertStatusValue(scope.row)['text']}}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="providerKind" :label="$t('message.ci.pipeKind')" width="100"></el-table-column>
                                <el-table-column prop="createDate" label="启动时间" width="160"></el-table-column>
                                <el-table-column prop="updateDate" width="160" label="最新状态时间"></el-table-column>
                                <el-table-column prop="costTime" label="耗时(Sec)">
                                    <template slot-scope="scope">
                                        {{scope.row.costTime?formatDuring(scope.row.costTime):''}}
                                    </template>
                                </el-table-column>
                                <el-table-column :label="$t('message.common.operation')" width="150">
                                    <template slot-scope="scope">
                                        <el-button type="info" @click="detail(scope.row)">{{$t('message.common.detail')}}</el-button>
                                        <el-button v-if="scope.row.status == 1" type="danger"  @click="stopTask(scope.row.id)">{{$t('message.common.stop')}}</el-button>
                                        <el-button v-if="scope.row.status == 2" type="warning" @click="rollbackTask(scope.row)">{{$t('message.common.rollback')}}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>

                    <el-table-column prop="runId" label="RunId" width="240"></el-table-column>
                    <el-table-column prop="status" :label="$t('message.common.status')" width="120">
                        <template slot-scope="scope">
                            <el-tag  :color="convertStatusType(scope.row)" style="color: #ffffffeb;border: 1px solid #99bce0;">
                                <img v-bind:src="convertStatusValue(scope.row)['img']" />
                                {{convertStatusValue(scope.row)['text']}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" width="260" :label="$t('message.common.createDate')"></el-table-column>
                    <el-table-column prop="updateDate" width="160" :label="$t('message.common.updateDate')"></el-table-column>
                    <el-table-column prop="costTime" :label="$t('message.ci.costTime')">
                        <template slot-scope="scope">
                            {{scope.row.costTime?formatDuring(scope.row.costTime):''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createByName" width="160" :label="$t('message.common.createBy')"></el-table-column>
                </el-table>



            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>
    </section>
</template>
<script>
    import OrchestrationHistory from './OrchestrationHistory.js'
    export default OrchestrationHistory
</script>
<style>
    .expand-table-cell{
        font-weight: 400 !important;
    }
</style>
