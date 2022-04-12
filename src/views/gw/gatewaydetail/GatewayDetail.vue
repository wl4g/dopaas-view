<template>
    <section id="configuration" class="configuration">

        <el-tabs v-model="activeName">
            <el-tab-pane label="详情" name="first">
                <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="$t('message.common.name')" prop="name">
                                <el-input v-model="saveForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="命名空间" prop="namespace">
                                <el-input v-model="saveForm.namespace"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="地址" prop="address">
                                <el-input v-model="saveForm.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="启用" prop="status">
                                <el-switch v-model="saveForm.status" :active-value="'1'" :inactive-value="'0'"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <organization-selector :inputData="{organizationCode: saveForm.organizationCode}"
                                                   @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
                        </el-col>
                    </el-row>
                </el-form>
                <el-button type="primary" @click="saveData()" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </el-tab-pane>
            <el-tab-pane label="路由" name="second">

            </el-tab-pane>
        </el-tabs>
    </section>
</template>


<script>
    import GatewayDetail from './GatewayDetail.js'

    export default GatewayDetail
</script>

<style scoped>

</style>

