<template>

    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">

            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="请输入规则名称"></el-input>
            </el-form-item>

            <el-form-item :label="$t('message.common.classify')">
                    <el-select v-model="searchParams.classify" @change="getMetricByClassify()" clearable>
                        <el-option
                                v-for="item in dictutil.getDictListByType('metric_classify')"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
            </el-form-item>

            <el-form-item :label="$t('message.umc.metric')">
               <!-- <el-input v-model="searchParams.metric" placeholder="Metric"></el-input>-->

                <el-select v-model="searchParams.metricId" filterable clearable>
                    <el-option
                            v-for="item in metricList"
                            :key="item.id"
                            :label="item.metric"
                            :value="item.id">
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
            <el-button type="primary" @click="addTemplatOld()"> old + </el-button>
            <el-button type="primary" @click="addTemplat()"> + </el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width: 100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="name" :label="$t('message.common.name')" min-width="220"></el-table-column>
                    <el-table-column prop="metric" :label="$t('message.umc.metric')" min-width="220"></el-table-column>

                    <el-table-column prop="classify" :label="$t('message.common.classify')">
                        <template slot-scope="scope">
                            <el-tag type="primary">{{convertClassifyValue(scope.row.classify)}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="notifyLevel" :label="$t('message.umc.alarmLevel')">
                        <template slot-scope="scope">
                            <el-tag :type="convertStatusType(scope.row.notifyLevel)">{{convertLevelValue(scope.row.notifyLevel)}}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column :label="$t('message.common.operation')" min-width="140">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' @click="editTemplat(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' @click="delTemplat(scope.row)">{{$t('message.common.del')}}</el-button>
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
                    <el-col :span="6">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name" placeholder="Name"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item :label="$t('message.common.classify')">
                            <el-select v-model="saveForm.classify" @change="getMetricByClassifyForm()">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('metric_classify')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>

                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item :label="$t('message.umc.metric')" prop="addr">
                            <el-select v-model="saveForm.metricId" filterable>
                                <el-option
                                        v-for="item in metricList2"
                                        :key="item.id"
                                        :label="item.metric"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item :label="$t('message.umc.alarmLevel')" >
                            <el-select v-model="saveForm.notifyLevel" placeholder="请选择">
                                <!-- TODO -->
                                <el-option label="warn" :value="1"></el-option>
                                <el-option label="error" :value="2"></el-option>
                                <el-option label="danger" :value="3"></el-option>
                                <el-option label="death" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- tags -->
                <el-row >
                    <el-col>
                        <el-form-item :label="$t('message.scm.tag')">
                            <template>
                                <el-table :data="saveForm.tagMap" :border="false" style="width: 100%">
                                    <!-- 动态标签 -->
                                    <el-table-column prop="name" :label="$t('message.common.name')">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.name" placeholder="tagName"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="value" :label="$t('message.share.value')" >
                                        <template slot-scope="scope">
                                            <el-input  v-model="scope.row.value"></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.common.operation')">
                                        <template slot-scope="scope">
                                            <el-row>
                                                <el-button @click.native.prevent="deleteTag(scope.$index)" type="danger">
                                                    Delete
                                                </el-button>
                                            </el-row>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!--</div>-->
                            <el-button type="primary"  @click.native.prevent="addTag()"> + </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- rules -->
                <el-row >
                    <el-col>
                        <el-form-item :label="$t('message.umc.rule')">
                            <template>
                                <el-table :data="saveForm.rules" :border="false" style="width: 100%">
                                    <!-- 动态标签 -->
                                    <el-table-column  :label="$t('message.umc.logicalOperator')" >
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.logicalOperator" placeholder="LogicalOperator">
                                                <el-option label="or" :value="1"></el-option>
                                                <el-option disabled label="and" :value="2"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  :label="$t('message.umc.aggregator')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.aggregator" placeholder="Aggregator">
                                                <el-option label="avg" value='avg'></el-option>
                                                <el-option label="sum" value='sum'></el-option>
                                                <el-option label="min" value='min'></el-option>
                                                <el-option label="max" value='max'></el-option>
                                                <el-option label="latest" value='latest'></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('message.umc.relateOperator')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.relateOperator" placeholder="RelateOperator">
                                                <el-option label="=" :value="1"></el-option>
                                                <el-option label=">" :value="2"></el-option>
                                                <el-option label=">=" :value="3"></el-option>
                                                <el-option label="<" :value="4"></el-option>
                                                <el-option label="<=" :value="5"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.share.value')" >
                                        <template slot-scope="scope">
                                            <el-input  v-model="scope.row.value"></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column  :label="$t('message.umc.queueTime')" >
                                        <template slot-scope="scope">
                                            <el-input  v-model="scope.row.queueTimeWindow"></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column  :label="$t('message.umc.alarmLevel')">
                                        <template slot-scope="scope">
                                            <el-select v-model="scope.row.alarmLevel" placeholder="AlarmLevel">
                                                <el-option label="warn" :value="1"></el-option>
                                                <el-option label="error" :value="2"></el-option>
                                                <el-option label="danger" :value="3"></el-option>
                                                <el-option label="death" :value="4"></el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.common.operation')" >
                                        <template slot-scope="scope">
                                            <el-row>
                                                <el-button @click.native.prevent="deleteRule(scope.$index)" type="danger" >
                                                    {{$t('message.common.del')}}
                                                </el-button>
                                            </el-row>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!--</div>-->
                            <el-button type="primary"  @click.native.prevent="addRule()"> + </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveTemplat()">{{$t('message.common.save')}}</el-button>
                        <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
                    </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="newDialogVisible" width="80%" v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline">
                <el-row>
                    <el-col :span="6">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name" placeholder="请输入规则名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('message.common.classify')">
                            <el-select v-model="saveForm.classify" @change="getMetricByClassifyForm()">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('metric_classify')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>

                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('message.umc.metric')" prop="addr">
                            <el-select v-model="saveForm.metricId" filterable>
                                <el-option
                                        v-for="item in metricList2"
                                        :key="item.id"
                                        :label="item.metric"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('message.umc.alarmLevel')" >
                            <el-select v-model="saveForm.notifyLevel" placeholder="请选择">
                                <!-- TODO -->
                                <el-option label="warn" :value="1"></el-option>
                                <el-option label="error" :value="2"></el-option>
                                <el-option label="danger" :value="3"></el-option>
                                <el-option label="death" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- tags -->
                <el-row >
                    <el-col>
                        <el-form-item :label="$t('message.scm.tag')">
                            <template>
                                <el-table :data="saveForm.tagMap" :border="false" style="width: 100%">
                                    <!-- 动态标签 -->
                                    <el-table-column prop="name" :label="$t('message.common.name')">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.name" placeholder="tagName"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="value" :label="$t('message.share.value')" >
                                        <template slot-scope="scope">
                                            <el-input  v-model="scope.row.value"></el-input>
                                        </template>
                                    </el-table-column>

                                    <el-table-column :label="$t('message.common.operation')">
                                        <template slot-scope="scope">
                                            <el-row>
                                                <el-button @click.native.prevent="deleteTag(scope.$index)" type="danger">
                                                    Delete
                                                </el-button>
                                            </el-row>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <!--</div>-->
                            <el-button type="primary"  @click.native.prevent="addTag()"> + </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- rules -->
                <el-row >
                    <el-col>
                        <el-form-item :label="$t('message.umc.rule')">
                            <template>
                                <MyEditor
                                    style="width:90%;height:150px"
                                    :language="'sql'"
                                    :codes="sqlCodes"
                                    @onMounted="sqlOnMounted"
                                    @onCodeChange="sqlOnCodeChange" />
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveTemplat()">{{$t('message.common.save')}}</el-button>
                <el-button @click="newDialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script>
    import Templat from './Templat.js'
    export default Templat
</script>
<style scoped>
</style>
