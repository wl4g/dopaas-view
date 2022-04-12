<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native.prevent="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input v-model="searchParams.name" placeholder="e.g. localhost" style="width:165px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>

            <el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >+ Add</el-button>
        </el-form>

        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <div class="query">
            <div class="query-left">
                <div class="line"></div>
                Result Total： <span class="number">{{total}}</span>
            </div>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="registryAddress" label="地址">
                        <template slot-scope="scope">
                            <a :href="'http://'+scope.row.registryAddress" target="_Blank">{{scope.row.registryAddress}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="120">
                        <template slot-scope="scope">
                            <el-button v-if="permitutil.hasPermit('cmdb:dockerrepository:edit')" type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="pageNum" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="注册地址" prop="registryAddress">
                            <el-input v-model="saveForm.registryAddress"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="saveForm.authConfigModel.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="saveForm.authConfigModel.password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <organization-selector :inputData="{organizationCode: saveForm.organizationCode}" @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveData()" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>
    </section>
</template>


<script>
    import DockerRepository from './DockerRepository.js'

    export default DockerRepository
</script>

<style scoped>

</style>

