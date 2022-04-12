<template>
    <div>
        <!--<el-row>
            <el-col :offset="1" :span="20">
                <span>正在编辑文件 ，语言为：{{saveForm.lang}}</span>
            </el-col>
        </el-row>-->
        <el-form label-width="80px" :model="saveForm" ref="saveForm" :rules="rules" class="demo-form-inline">
            <el-row>
                <el-col :span="4">
                    <el-form-item :label="$t('message.common.name')"  prop="name">
                        <el-input v-model="saveForm.name" placeholder="e.g. fileName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item :label="$t('message.common.language')" prop="lang">
                        <el-select clearable v-model="saveForm.lang">
                            <el-option
                                    v-for="item in dictutil.getDictListByType('doc_lang_type')"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('message.share.label')"  prop="labelIds">
                        <el-select clearable multiple filterable v-model="saveForm.labelIds" style="width: 100%">
                            <el-option
                                    v-for="item in labelData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :offset="5" :span="3" >
                    <el-button type="success" @click="save">Save</el-button>
                    <el-button type="primary" @click="goBack">Back</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item :label="$t('message.doc.description')">
                        <el-input type="textarea" :rows="1" v-model="saveForm.description" placeholder="e.g. description"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :offset="1" :span="7" v-if="saveForm.id">
                    <el-form-item :label="$t('message.doc.history')">
                        <el-select v-model="saveForm.id" @change="changeChangesId" style="width: 100%">
                            <el-option
                                    v-for="item in changesData"
                                    :key="item.id"
                                    :label="getHistoryLabel(item)"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <mavon-editor  ref="md" v-model="saveForm.content" @save="save" @imgAdd="imgAdd" @fullScreen="onFullScreen" style="margin-left:20px;;min-height: 500px"/>
        </el-form>
    </div>

</template>

<script>
    import MdEdit from './MdEdit.js'
    export default MdEdit
</script>
<style>
    .v-note-panel img {
        height: auto;
        width: auto;
    }
</style>

