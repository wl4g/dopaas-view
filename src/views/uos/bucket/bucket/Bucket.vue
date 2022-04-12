<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.coss.cossProvider')">
                <el-select clearable v-model="searchParams.cossProvider">
                    <el-option
                            v-for="item in cossProviders"
                            :key="item.name"
                            :label="item.name"
                            :disabled="!item.enable"
                            :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.coss.prefix')">
                <el-input v-model="searchParams.prefix" placeholder="e.g. Gitlab" style="width:150px;"></el-input>
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
                {{$t('message.common.total')}}:<span class="number">{{total}}</span>
            </div>
            <!-- 新增按钮 -->
            <el-button type="primary" @click="openSaveForm">+ Add</el-button>
        </div>
        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" :border="false" style="width:100%" @row-dblclick="detail">
                    <el-table-column prop="name" :label="$t('message.common.name')">
                        <template slot-scope="scope">
                            <a style="cursor:pointer" @click="detail(scope.row)">{{scope.row.name}}</a>
                        </template>
                    </el-table-column>

                    <el-table-column prop="owner.displayName" :label="$t('message.common.owner')"></el-table-column>
                    <el-table-column prop="creationDate" :label="$t('message.common.createDate')" :formatter="dateFormat"></el-table-column>

                    <el-table-column :label="$t('message.common.operation')" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="detail(scope.row)">{{$t('message.common.manager')}}</el-button>
                            <el-button type="text" @click="getAcl(scope.row)">权限</el-button>
                            <el-button type="text" @click="resetBucketAcl(scope.row)">重置权限</el-button>
                            <el-button type="text" @click="deleteBucket(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <!--<el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>-->

        <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="dialogVisible" width="30%">
            <el-form label-width="100px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.coss.cossProvider')" prop="cossProvider">
                            <el-select v-model="saveForm.cossProvider">
                                <el-option
                                        v-for="item in cossProviders"
                                        :key="item.name"
                                        :label="item.name"
                                        :disabled="!item.enable"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="$t('message.common.name')" prop="bucketName">
                            <el-input v-model="saveForm.bucketName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createBucket" >{{$t('message.common.save')}}</el-button>
                <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" title="ACL" :visible.sync="aclDialog" width="30%">

            <el-radio-group v-model="aclForm.acl">
                <el-radio-button label="Default">私有</el-radio-button>
                <!--<el-radio-button label="Private">私有</el-radio-button>-->
                <el-radio-button label="PublicRead">公共读</el-radio-button>
                <el-radio-button label="PublicReadWrite">公共读写</el-radio-button>
            </el-radio-group>
            <el-collapse accordion>
                <el-collapse-item title="配置">
                    <div><span>{{aclForm.config}}</span></div>
                </el-collapse-item>
            </el-collapse>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setAcl">{{$t('message.common.save')}}</el-button>
                <el-button @click="aclDialog = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>


    </section>
</template>


<script>
    import Bucket from './Bucket.js'

    export default Bucket
</script>

<style scoped>

</style>

