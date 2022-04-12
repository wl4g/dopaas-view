<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="demo-form-inline" @keyup.enter.native="onSubmit()">
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
                <el-button type="primary" @click="addData()" style='float:right;margin:5px'> + </el-button>
            </div>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" style="width: 100%" :border="false">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="templateName" :label="$t('message.umc.template')" ></el-table-column>
                    <el-table-column prop="contactGroupName" :label="$t('message.ci.contactGroup')"></el-table-column>
                    <el-table-column prop="callbackUrl" :label="$t('message.umc.callbackUrl')"></el-table-column>
                    <el-table-column :label="$t('message.common.operation')">
                        <template slot-scope="scope">
                            <el-button type="info" icon='edit' size="small" @click="dataDetail(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete' size="small" @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
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
                    <el-col :span="8">
                        <el-form-item :label="$t('message.common.group')" prop="group">
                            <el-select v-model="saveForm.group" @change="getinstance()" placeholder="Please group" style="width: 100%">
                                <el-option
                                        v-for="item in groupData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item :label="$t('message.ci.env')" >
                            <el-select v-model="saveForm.environment" @change="getinstance()" placeholder="Please Env" style="width: 100%">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('app_ns_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item :label="$t('message.ci.instances')" prop="instances">
                            <el-select v-model="saveForm.collectId"  placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in instanceData"
                                        :key="item.id"
                                        :label="item.hostname"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('message.common.classify')" prop="Classify">
                            <el-select v-model="saveForm.classify" @change="getTemplateByClassify()">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('metric_classify')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('message.umc.template')" >
                            <el-select v-model="saveForm.templateId"  placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in templates"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('message.ci.contactGroup')" >
                            <el-select v-model="saveForm.contactGroupId"  placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in contactGroups"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.umc.callbackUrl')" >
                            <el-input  v-model="saveForm.callbackUrl" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveData()">{{$t('message.common.save')}}</el-button>
                        <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
                    </span>
        </el-dialog>
    </section>
</template>
<script>
    import Config from './Config.js'
    export default Config
</script>
<style scoped>

</style>
