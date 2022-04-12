<template>
    <section id="configuration" class="configuration">
        <el-row>
            <el-col :span="20">
                <span style="font-size: 20px">概览:</span>

            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="toFs" >文件管理</el-button>
                <el-button type="primary" @click="back" >{{$t('message.common.back')}}</el-button>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="6">
                <el-card class="box-card" style="height: 180px">
                    <div slot="header" class="clearfix">
                        <span>存储用量</span>
                        <el-select value="total" style="float: right">
                            <el-option label="总用量" value="total"></el-option>
                        </el-select>
                    </div>
                    <div style="text-align: center;">
                        <span style="font-size: 25px">{{indexData.storageUsage}}</span>
                        <span style="font-size: 18px;float: right">{{indexData.storageUsageUnit}}</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :offset="1" :span="6">
                <el-card class="box-card" style="height: 180px">
                    <div slot="header" class="clearfix">
                        <span>本月请求次数</span>
                        <el-select value="read" style="float: right">
                            <el-option label="读请求" value="read"></el-option>
                        </el-select>
                    </div>
                    <div style="text-align: center;">
                        <span style="font-size: 25px">{{indexData.numberOfRequests}}</span><br><br>
                        <!--<span style="font-size: 10px">上月请求次数: 123,456</span>-->
                    </div>
                </el-card>
            </el-col>
            <el-col :offset="1" :span="6">
                <el-card class="box-card" style="height: 180px">
                    <div slot="header" class="clearfix">
                        <span>文件数量</span>
                    </div>
                    <div style="text-align: center;">
                        <span style="font-size: 25px">{{indexData.numberOfDocuments}}</span>
                    </div>
                </el-card>
            </el-col>

        </el-row>



    </section>
</template>


<script>
    import BucketDetail from './BucketDetail.js'

    export default BucketDetail
</script>

<style scoped>

</style>

