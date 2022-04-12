<template>
    <div>
        <el-form label-width="120px"  class="demo-form-inline">

            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('message.doc.description')">
                        <el-input type="textarea" :rows="1" v-model="file1dec" readonly ></el-input>
                    </el-form-item>
                </el-col>
                <el-col  :offset="3" :span="8">
                    <el-form-item :label="$t('message.common.language')">
                        <el-tag :type="dictutil.getDictThemesByTypeAndValue('doc_lang_type',file1lang)" size="medium">{{dictutil.getDictLabelByTypeAndValue('doc_lang_type',file2lang)}}</el-tag>
                    </el-form-item>
                </el-col>
                <el-col :offset="3" :span="1">
                    <el-button type="primary" @click="goBack">Back</el-button>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('message.doc.history')">
                        <el-select clearable v-model="file1" @change="changeChangesId" style="width: 100%">
                            <el-option
                                    v-for="item in changesData"
                                    :key="item.id"
                                    :label="getHistoryLabel(item)"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :offset="3" :span="8">
                    <el-form-item :label="$t('message.doc.history')">
                        <el-select clearable v-model="file2" @change="changeChangesId"  style="width: 100%">
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
        </el-form>
        <code-diff :old-string="file1Str" :new-string="file2Str" :context="999999999"  outputFormat="side-by-side"/>
    </div>
</template>

<script>
    import Diff from './Diff.js'
    export default Diff
</script>

