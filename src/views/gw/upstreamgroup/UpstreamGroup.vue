<template>
    <section id="configuration" class="configuration">
        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="服务器分组" name="first">
                <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
                    <el-form-item :label="$t('message.common.name')">
                        <el-input v-model="searchParams.name" placeholder="e.g. abc" style="width:165px"></el-input>
                    </el-form-item>
                    <input hidden></input>
                    <el-form-item>
                        <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
                    </el-form-item>

                    <el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >+ Add</el-button>
                </el-form>

                <!--================================table================================-->
                <!-- 查询结果数值 -->
                <div class="query">
                    <div class="query-left">
                        <div class="line"></div>
                        Result Total： <span class="number">{{total}}</span>
                    </div>
                </div>
                <!-- 查询结果表格 -->
                <div>
                    <template>
                        <el-table :data="tableData" :border="false" style="width:100%">
                            <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                            <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
                            <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                            <el-table-column :label="$t('message.common.operation')" min-width="120">
                                <template slot-scope="scope">
                                    <el-button type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                                    <el-button type="danger" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </div>
                <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

                <!--================================save dialog================================-->
                <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  v-loading='dialogLoading'>
                    <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item :label="$t('message.common.name')" prop="name">
                                    <el-input v-model="saveForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <organization-selector :inputData="{organizationCode: saveForm.organizationCode}" @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item :label="$t('message.ci.pipeline')">
                                    <template>
                                        <el-table :data="saveForm.gwUpstreamGroupRefs" :border="false" style="width: 100%">
                                            <!-- 动态标签 -->
                                            <el-table-column prop="name" width="250" :label="$t('message.common.name')">
                                                <template slot-scope="scope">
                                                    <el-select v-model="scope.row.upstreamId" filterable style="width: 100%" @change="fixUpstreamsShow()">
                                                        <el-option
                                                                v-for="item in scope.row.showUpstream"
                                                                :key="item.id"
                                                                :label="item.name"
                                                                :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="weight" label="权重" width="180">
                                                <template slot="header" slot-scope="scope">
                                                    权重
                                                    <el-tooltip placement="top">
                                                        <div slot="content">权重越大，压力越大</div>
                                                        <i class="el-icon-question"></i>
                                                    </el-tooltip>
                                                </template>
                                                <template slot-scope="scope">
                                                    <!--<el-input  v-model="scope.row.priority"></el-input>-->
                                                    <el-input-number v-model="scope.row.weight" :step="1" :max="1000" step-strictly></el-input-number>
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


                    </el-form>
                    <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveData()" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
                </el-dialog>
            </el-tab-pane>

            <el-tab-pane label="服务器" name="second">
                <upstream></upstream>
            </el-tab-pane>
        </el-tabs>


    </section>
</template>


<script>
    import UpstreamGroup from './UpstreamGroup.js'

    export default UpstreamGroup
</script>

<style scoped>

</style>

