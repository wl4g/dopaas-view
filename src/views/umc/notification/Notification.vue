<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline" @keyup.enter.native="onSubmit()">

            <el-form-item :label="$t('message.common.createDate')">
                <el-date-picker v-model="searchParams.startDate" type="date" placeholder="Start Date" format="yyyy - MM - dd " ></el-date-picker>
                <el-date-picker v-model="searchParams.endDate" type="date" placeholder="End Date" format="yyyy - MM - dd" ></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button @click="onSubmit" type="success">{{$t('message.common.search')}}</el-button>
            </el-form-item>
        </el-form>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <div class="query">
            <div class="line"></div>
            <div class="">Result Total： <span class="number">{{total}}</span>
                <!-- 新增按钮 -->
            </div>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" style="width: 100%" :border="false">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="alarmTime" :label="$t('message.umc.alarmTime')" :formatter="timestampToTime"></el-table-column>
                    <!--<el-table-column prop="groupName" label="GroupName">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="dataDetail(scope.row)">{{scope.row.groupName}}</el-button>
                        </template>
                    </el-table-column>-->

                    <el-table-column :label="$t('message.common.operation')">
                        <template slot-scope="scope">
                            <el-button type="info" size="small">{{$t('message.common.detail')}}</el-button>
                            <!--<el-button type="text" size="small" @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>-->
                        </template>
                    </el-table-column>

                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" size="small" v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline">

                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.umc.alarmTime')" >
                            <el-input :value="timestampToTime(null,null,saveForm.alarmTime)" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.umc.alarmNote')" >
                            <el-input type="textarea" v-model="saveForm.alarmNote" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.ci.contact')">
                            <template>
                                <el-table :data="saveForm.contacts" style="width: 100%" :border="false">

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
                        <!--<el-button type="primary" @click="saveData()">{{$t('message.common.save')}}</el-button>-->
                        <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
                    </span>
        </el-dialog>
    </section>
</template>


<script>
    import Notification from './Notification.js'

    export default Notification
</script>

<style scoped>

</style>

