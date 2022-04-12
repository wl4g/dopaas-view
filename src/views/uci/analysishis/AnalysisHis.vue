<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" class="demo-form-inline" @keyup.enter.native="onSubmit()">
            <el-form-item>
                <el-button @click="onSubmit" type="success">{{ $t('message.common.search') }}</el-button>
            </el-form-item>
        </el-form>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <div class="query">
            <div class="line"></div>
            <div>{{ $t('message.common.total') }}<span class="number">{{total}}</span>
            </div>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" style="width:100%" :border="false">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column width="100" prop="id" label="ID"></el-table-column>
                    <el-table-column prop="projectId" :label="$t('message.ci.projectId')"></el-table-column>
                    <el-table-column prop="analyzerKind" :label="$t('message.ci.analyzerKind')"></el-table-column>
                    <el-table-column prop="language" :label="$t('message.common.language')"></el-table-column>
                    <el-table-column prop="assetVersion" :label="$t('message.ci.assetVersion')"></el-table-column>
                    <el-table-column prop="assetBytes" :label="$t('message.ci.assetBytes')"></el-table-column>
                    <el-table-column prop="assetAnalysisSize" :label="$t('message.ci.assetAnalysisSize')"></el-table-column>
                    <el-table-column prop="state" :label="$t('message.common.status')">
                        <template slot-scope="{row}">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('ci_analysis_state',row.state)">{{dictutil.getDictLabelByTypeAndValue('ci_analysis_state',row.state)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bugCollectionFile" :label="$t('message.ci.bugCollectionFile')"></el-table-column>
                    <el-table-column prop="createDate" :label="$t('message.common.createDate')"></el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

    </section>
</template>


<script>
    import AnalysisHis from './AnalysisHis.js'

    export default AnalysisHis
</script>


