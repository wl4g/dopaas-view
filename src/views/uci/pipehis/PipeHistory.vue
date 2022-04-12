<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" class="searchbar" :model="searchParams"  @keyup.enter.native="onSubmit()">

            <el-form-item :label="$t('message.ci.cluster')">
                <el-input v-model="searchParams.groupName" placeholder="e.g. sso | portal"></el-input>
            </el-form-item>

            <el-form-item label="管道名">
                <el-input v-model="searchParams.pipeName" placeholder="e.g. safecloud-web-portal"></el-input>
            </el-form-item>

            <!--<el-form-item :label="$t('message.ci.branchName')">
                <el-input v-model="searchParams.branchName" placeholder="1.0.1-rc1"></el-input>
            </el-form-item>-->

            <el-form-item :label="$t('message.common.createDate')">
                <el-date-picker v-model="searchParams.startDate" type="date" placeholder="Start Date" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:160px;"></el-date-picker>
                <el-date-picker v-model="searchParams.endDate" type="date" placeholder="End Date" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:160px;"></el-date-picker>
            </el-form-item>

            <el-form-item :label="$t('message.ci.env')">
                <el-select v-model="searchParams.envType" clearable placeholder="Env Type" style="width:105px;">
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
            <el-form-item style='float:right'>
                <!-- 新增按钮 -->
                <!--<el-button type="primary" @click="create()">Create</el-button>-->
            </el-form-item>
        </el-form>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <!--<div class="query">
            <div class="query-left">
                <div class="line"></div>
                {{$t('message.common.total')}}： <span class="number">{{total}}</span>
            </div>
        </div>-->
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column width="80" prop="id" label="ID" ></el-table-column>
                    <el-table-column prop="clusterName" :label="$t('message.ci.cluster')"></el-table-column>
                    <el-table-column prop="pipeName" label="管道名"></el-table-column>
                    <!--<el-table-column prop="branchName" :label="$t('message.ci.branchName')"></el-table-column>-->
                    <el-table-column prop="providerKind" :label="$t('message.ci.pipeKind')" width="100"></el-table-column>
                    <el-table-column prop="envType" :label="$t('message.ci.env')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('app_ns_type',scope.row.environment)">{{dictutil.getDictLabelByTypeAndValue('app_ns_type',scope.row.environment)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" :label="$t('message.common.status')">
                        <template slot-scope="scope">
                            <el-tag  :color="convertStatusType(scope.row)" style="color: #ffffffeb;border: 1px solid #99bce0;">
                                <img v-bind:src="convertStatusValue(scope.row)['img']" />
                                {{convertStatusValue(scope.row)['text']}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="humanCreateDate" :label="$t('message.common.createDate')"></el-table-column>
                    <el-table-column prop="createByName" :label="$t('message.common.createBy')"></el-table-column>
                    <el-table-column prop="humanUpdateDate" :label="$t('message.common.updateDate')"></el-table-column>
                    <el-table-column prop="costTime" :label="$t('message.ci.costTime')">
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
        </div>
        <!--<el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>-->
        <el-pagination
                @size-change="currentChange"
                @current-change="currentChange"
                :current-page.sync="pageNum"
                :page-size.sync="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </section>
</template>
<script>
    import PipeHistory from './PipeHistory.js'
    export default PipeHistory
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
    }
</style>
