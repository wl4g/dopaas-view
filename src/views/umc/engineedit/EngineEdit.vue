<template>
    <section id="configuration" class="configuration">
        <el-row>
            <el-col :offset="1" :span="1">
                <el-button type="primary" @click="previousStep">{{step===1?'取消':'上一步'}}</el-button>
            </el-col>
            <el-col :offset="2" :span="16">
                <el-steps :active="step" finish-status="success">
                    <el-step title="步骤 1"></el-step>
                    <el-step title="步骤 2"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
            </el-col>
            <el-col :offset="1" :span="1">
                <el-button type="primary" @click="nextStep">{{step===2?'完成':'下一步'}}</el-button>
            </el-col>
        </el-row>

        <el-form v-if="step===1" label-width="100px" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
            <el-row>
                <el-col :offset="2" :span="10">
                    <el-form-item :label="$t('message.common.name')" prop="name">
                        <el-input v-model="saveForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item :label="$t('message.umc.dataSourceProvide')" prop="datasourceId">
                        <el-select v-model="saveForm.datasourceId" style="width: 100%">
                            <el-option
                                    v-for="item in dataSources"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :offset="2" :span="10">
                    <el-form-item :label="$t('message.ci.cron')" prop="cron">
                        <el-popover placement="right" width="200" trigger="focus" title="Last 5 run times:">
                            <el-input type="textarea" :rows="10" :readonly="true" v-model="checkResult"></el-input>
                            <el-input slot="reference" v-model="saveForm.cron" placeholder="e.g. 0/5 30 * * * ?" @input="checkCron"></el-input>
                        </el-popover>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item :label="$t('message.ci.contactGroup')" prop="notifyGroupIds">

                        <el-select v-model="saveForm.notifyGroupIds" multiple placeholder="请选择" style="width: 100%">
                            <el-option
                                    v-for="item in contactGroupData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="2" :span="10">
                    <el-form-item :label="$t('message.common.remark')" prop="remark">
                        <el-input v-model="saveForm.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item :label="$t('message.common.status')" prop="status">
                        <el-switch v-model="saveForm.status" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-form v-if="step===2" label-width="100px" :model="saveForm" ref="saveForm2" class="demo-form-inline" :rules="rules">

            <el-form-item label="codeContent" prop="codeContent">
                <el-input v-model="saveForm.codeContent" type="textarea"></el-input>
            </el-form-item>

            <el-form-item label="notifyTemplate" prop="notifyTemplate">
                <el-input v-model="saveForm.notifyTemplate" type="textarea"></el-input>
            </el-form-item>

        </el-form>



    </section>
</template>


<script>
    import EngineEdit from './EngineEdit.js'

    export default EngineEdit
</script>

<style scoped>

</style>

