<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">

            <el-form-item :label="$t('message.umc.metric')">
                <el-input v-model="searchParams.metric" placeholder="Metric"></el-input>
            </el-form-item>

            <el-form-item :label="$t('message.common.classify')">
                <el-select v-model="searchParams.classify">
                    <el-option label="all" value=""></el-option>
                    <el-option
                            v-for="item in dictutil.getDictListByType('metric_classify')"
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
            <!-- 新增按钮 -->
            <el-button type="primary" @click="addData()" > + </el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width: 100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="metric" :label="$t('message.umc.metric')"></el-table-column>

                    <!--<el-table-column prop="classify" :label="$t('message.common.classify')">
                        <template slot-scope="scope">
                            <el-tag type="primary">{{convertClassifyValue(scope.row.classify)}}</el-tag>
                        </template>
                    </el-table-column>-->

                    <el-table-column prop="classify" :label="$t('message.common.classify')">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('metric_classify',scope.row.classify)">{{dictutil.getDictLabelByTypeAndValue('metric_classify',scope.row.classify)}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline">

                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('message.umc.metric')" prop="addr">
                            <el-input v-model="saveForm.metric" placeholder="Metric"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('message.common.classify')">
                            <el-select v-model="saveForm.classify">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('metric_classify')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveData()" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                        <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
                    </span>
        </el-dialog>
    </section>
</template>


<script>
    import MetricTemplate from './MetricTemplate.js'

    export default MetricTemplate
</script>

<style scoped>

</style>

