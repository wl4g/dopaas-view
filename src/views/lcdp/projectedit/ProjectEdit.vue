<template>
    <section id="configuration" class="configuration">
        <div style="margin : 0 100px 0 100px;">
            <el-form label-width="100px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="saveForm.projectName" placeholder="e.g: myproject"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="版本号" prop="version">
                            <el-input v-model="saveForm.version" placeholder="e.g: 0.0.1-SNAPSHOT"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">&nbsp;</el-col>
                    <el-col :span="9">&nbsp;</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="组织类型" prop="organType">
                            <el-input v-model="saveForm.organType"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="组织名" prop="organName">
                            <el-input v-model="saveForm.organName" placeholder="e.g: mycompany"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">&nbsp;</el-col>
                    <el-col :span="9">&nbsp;</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="源文件包路径:" prop="packageName">
                            <el-input disabled v-model="saveForm.organType +'.'+ saveForm.organName +'.'+ saveForm.projectName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="作者信息" prop="author">
                            <el-input v-model="saveForm.author" placeholder="e.g: Administrator"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">&nbsp;</el-col>
                    <el-col :span="9">&nbsp;</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="数据源">
                            <el-select v-model="saveForm.datasourceId" filterable style="width: 100%">
                                <el-option
                                        v-for="item in datasources"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="引入号" prop="since">
                            <el-tooltip class="item" effect="dark" content="如，java的@since注解，表示此api从哪个版本开始引进的" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            <el-input v-model="saveForm.since" style="width:92%" placeholder="e.g: v1.0"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">&nbsp;</el-col>
                    <el-col :span="9">&nbsp;</el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">
                        <el-form-item label="生成模版组" prop="providerSet">
                            <el-select v-model="saveForm.providerSet" filterable style="width: 100%" @change="extraOptions">
                                <el-option
                                        v-for="item in genProviderSet"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="saveForm.extraOptions">
                    <el-col :span="18">
                        <el-table :data="saveForm.extraOptions" :border="false" style="width:100%" >
                            <el-table-column prop="name" label="扩展配置：" >
                                <template slot-scope="scope">
                                    <span>{{dictutil.getDictLabelByTypeAndValue('codegen_extra_type',scope.row.name)!='- -'?dictutil.getDictLabelByTypeAndValue('codegen_extra_type',scope.row.name):scope.row.name}}</span>
                                    <el-tooltip placement="top">
                                        <div slot="content">{{dictutil.getDictByTypeAndValue('codegen_extra_type',scope.row.name).remark}}</div>
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column prop="value" label="选项值" width="300">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.selectedValue" placeholder="请选择" style="width: 100%">
                                        <el-option
                                                v-for="item in scope.row.values"
                                                :key="item"
                                                :label="item"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">&nbsp;</el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="版权信息" prop="copyright">
                            <el-input type="textarea" :rows="10" v-model="saveForm.copyright" placeholder='/*
 * Copyright 2018 ~ 2035 the original author or authors. <wanglsir@gmail.com, 983708408@qq.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
                            '></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="备注描述" prop="remark">
                            <el-input type="textarea" :rows="2" v-model="saveForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="4">
                    <el-button type="primary" @click="saveData()" size="small" :loading="saveLoading">{{$t('message.common.save')}}</el-button>
                    <el-button @click="back" size="small">{{$t('message.common.cancel')}}</el-button>
                </el-col>
                <el-col :span="20">&nbsp;</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">&nbsp;</el-col>
            </el-row>
        </div>
    </section>
</template>


<script>
    import ProjectEdit from './ProjectEdit.js'

    export default ProjectEdit
</script>

<style scoped>

</style>

