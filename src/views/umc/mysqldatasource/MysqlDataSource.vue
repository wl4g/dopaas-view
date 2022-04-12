<template>
    <section id="configuration" class="configuration">

            <el-form label-width="100px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.umc.dataSourceProvide')" prop="provider">
                            <el-select v-model="saveForm.provider" style="width: 100%">
                                <el-option
                                        v-for="item in dataSourceProviders"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.umc.dataSourceUrl')" prop="url">
                            <el-input v-model="saveForm.url"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.umc.dataSourceUserName')" prop="username">
                            <el-input v-model="saveForm.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.umc.dataSourcePassword')" prop="password">
                            <el-input type="password" v-model="saveForm.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="testConnect()" :loading="connecting">{{$t('message.share.connectTest')}}</el-button>
                <el-button type="primary" @click="saveData()" >{{$t('message.common.save')}}</el-button>
                <el-button @click="back">{{$t('message.common.cancel')}}</el-button>
            </span>

    </section>
</template>


<script>
    import MysqlDataSource from './MysqlDataSource.js'

    export default MysqlDataSource
</script>

<style scoped>

</style>

