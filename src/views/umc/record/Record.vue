<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">

            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="Name"></el-input>
            </el-form-item>

            <el-form-item :label="$t('message.common.createDate')">
                <el-date-picker v-model="searchParams.startDate" type="date" placeholder="Start Date" format="yyyy - MM - dd "></el-date-picker>
                <el-date-picker v-model="searchParams.endDate" type="date" placeholder="End Date" format="yyyy - MM - dd"></el-date-picker>
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
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width: 100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="name" :label="$t('message.common.name')" ></el-table-column>
                    <el-table-column prop="gatherTime" :label="$t('message.umc.gatherTime')" :formatter="timestampToTime"></el-table-column>
                    <el-table-column prop="createTime" :label="$t('message.common.createDate')" :formatter="timestampToTime"></el-table-column>

                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="info" @click="detail(scope.row)">{{$t('message.common.detail')}}</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" width="80%" v-loading='dialogLoading'>


            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')">
                            <el-input v-model="saveForm.name" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.createDate')">
                            <el-input v-model="saveForm.createTime" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.umc.alarmNote')">
                            <el-input type="textarea" v-model="saveForm.alarmNote" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--TODO-->
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.umc.metric')">
                            <el-input v-model="saveForm.alarmTemplate.metric" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.umc.rule')">
                            <!-- 查询结果表格 -->
                            <!--<div style="float:left;width: 266%;" v-loading='dialogLoading'>-->
                            <template>
                                <el-table :data="saveForm.alarmRules" :border="false" style="width: 100%">

                                    <el-table-column :label="$t('message.umc.logicalOperator')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.logicalOperator">
                                                <el-option label="or" :value="1"></el-option>
                                                <el-option disabled label="and" :value="2"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.umc.aggregator')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.aggregator">
                                                <el-option
                                                        v-for="item in dictutil.getDictListByType('agg_oper_type')"
                                                        :key="item.key"
                                                        :label="item.label"
                                                        :value="item.key">
                                                </el-option>

                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.umc.relateOperator')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.relateOperator">
                                                <el-option label="=" :value="1"></el-option>
                                                <el-option label=">" :value="2"></el-option>
                                                <el-option label=">=" :value="3"></el-option>
                                                <el-option label="<" :value="4"></el-option>
                                                <el-option label="<=" :value="5"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.share.value')">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.value" readonly></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.umc.queueTime')">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.queueTimeWindow" readonly></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.umc.alarmLevel')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.alarmLevel" placeholder="AlarmLevel">
                                                <el-option label="warn" :value="1"></el-option>
                                                <el-option label="error" :value="2"></el-option>
                                                <el-option label="danger" :value="3"></el-option>
                                                <el-option label="death" :value="4"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.umc.compareValue')">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.compareValue" readonly></el-input>
                                        </template>
                                    </el-table-column>


                                </el-table>
                            </template>

                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.ci.contact')">
                            <template>
                                <el-table :data="saveForm.notificationContacts" style="width: 100%" :border="false">

                                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                                    <el-table-column prop="email" :label="$t('message.common.email')"></el-table-column>
                                    <el-table-column prop="phone" :label="$t('message.common.phone')"></el-table-column>
                                    <!-- 动态标签 -->
                                    <el-table-column prop="status" :label="$t('message.common.status')">
                                        <template slot-scope="scope">
                                            <el-tag type="primary">{{convertStatusValue(scope.row.status)}}</el-tag>
                                        </template>
                                    </el-table-column>


                                </el-table>
                            </template>

                        </el-form-item>

                    </el-col>
                </el-row>


            </el-form>
            <span slot="footer" class="dialog-footer">
                        <!--<el-button type="primary" @click="saveCollector()">{{$t('message.common.save')}}</el-button>-->
                        <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
                    </span>
        </el-dialog>
    </section>
</template>


<script>
    import Record from './Record.js'

    export default Record
</script>

<style scoped>

</style>
