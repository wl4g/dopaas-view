<template>
  <div class="body">
        <div class="title">概览</div>
        <div class="content">
            <div style="width:65%">
                <div class="leftCard">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>我的资源</span>
                            <el-button style="float: right; padding: 3px 0" type="text">集群列表</el-button>
                        </div>
                        <div style="display:flex;text-align:center">
                            <div class="my-resources ">
                                <div class="my-resources-title">集群</div>
                                <div class="my-resources-count">1</div>
                            </div>
                            <div class="my-resources ">
                                <div class="my-resources-title">正常</div>
                                <div class="my-resources-count">2</div>
                            </div>
                            <div class="my-resources ">
                                <div class="my-resources-title">异常</div>
                                <div class="my-resources-count">3</div>
                            </div>
                            <div class="my-resources ">
                                <div class="my-resources-title">总节点数</div>
                                <div class="my-resources-count">4</div>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div class="leftCard">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>运维任务</span>
                        </div>
                        <div class="devOps-content">
                            <div class="devOps-item">
                                <div class="devOps-title" style="display:flex;align-items: center;">
                                    <div>
                                        <newSelect :dataList='dataList' :labelProperty="labelProperty" @change="change" />
                                    </div>
                                    <div class="devOps-title-right">0 个集群可升级</div>
                                </div>
                            </div>
                            <div class="devOps-item">
                                <div class="devOps-title" style="display:flex;align-items: center;">
                                    <div>
                                        <newSelect :dataList='dataList' :labelProperty="labelProperty" @change="change" />
                                    </div>
                                    <div class="devOps-title-right">0 个集群可升级</div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
            <div style="width:35%">
                <div class="rightCard">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>快速入口</span>
                        </div>
                        <div class="fastEntrance">
                            <div class="fastEntrance-content">
                                <i class="el-icon-shopping-cart-full"></i>
                                <p>创建集群</p>
                            </div>
                            <div class="fastEntrance-content">
                                <i class="el-icon-shopping-cart-full"></i>
                                <p>帮助文档</p>
                            </div>
                            <div class="fastEntrance-content">
                                <i class="el-icon-monitor"></i>
                                <p>OpenAPI</p>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div class="rightCard">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>资源配额</span>
                            <el-button style="float: right; padding: 3px 0" type="text">申请更多配额</el-button>
                        </div>
                        <div >
                            <div class="resource-item" style="padding: 10px 20px">
                                <div class="resource-title" style="display:flex;align-items: center;justify-content: space-between;">
                                    <div>资源</div><div class="resource-title-right">用量/配额</div>
                                </div>
                                <div class="resource-content" v-for="(item, index) in resourceList" :key="index">
                                    <div>{{item.name}}</div>
                                    <div class="resource-title-right">{{item.value}}</div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div class="rightCard">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>近期更新</span>
                        </div>
                        <div class="history-item"> 
                            <div style="padding-bottom: 12px;" v-for="(item, index) in historyList" :key="index">
                                <div class="history-top-item">
                                    <div class="circle"></div>
                                    <div class="history-text">{{item.content}}</div>
                                </div>
                                <div class="history-botton-item">
                                    <div class="history-line"></div>
                                    <div class="history-time">{{item.time}}</div>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>

        </div>
  </div>
</template>

<script>
import overview from './overview.js'

export default overview
</script>

<style scoped lang='less'>
.body{
    width: 100%;
    height: 100%;
    
}
.title{
    font-size: 29px;
    font-weight: bold;
}
.content{
    display: flex;
}
.leftCard{
    padding-right: 4px;
}
.rightCard{
    padding-left: 4px;
}
.clearfix span{
    font-weight:bold;
    font-size: 15px;
}
.my-resources{
    display:flex;flex-direction: column;width: 25%;
} 
.my-resources-title{
    height: 35px;
    line-height: 35px;
    font-size: 13px;
    color: #8e96a0;
}
.my-resources-count{
    color: #182bf3;
}
.devOps-content{
    padding: 10px 20px
}
.devOps-item{
    border: 2px solid #e4e5e7;
    height: 200px;
}
.devOps-title{
    background: #f7f9fa;
    display:flex;
    justify-content: space-between;
}
.devOps-title-right{
    padding-right: 12px;
    color: #63d573;
}
.fastEntrance{
    display:flex;align-items:center;justify-content: space-around;
}
.fastEntrance-content{
    display:felx;
    text-align: center;
    color: #376fd4;
}
.fastEntrance{
    i{
        font-size: 28px;
        padding: 2px;
    }
    p{
        padding-bottom: 6px;
    }
}
.resource-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f7f9fa;
    border-bottom: solid 1px #f7f9fa;
    height: 35px;
    line-height: 35px;
    padding-left: 12px;
}
.resource-content{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1px #f7f9fa;
    height: 35px;
    line-height: 35px;
    padding-left: 12px;
}
.history-item{
    padding: 10px 20px;
    
}
.circle{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: none;
    border: 2px solid #dcdfe6;
}
.history-text{
    padding-left: 8px;
    font-weight: bold;
}
.history-top-item{
    display: flex;
    align-items: center;
    color: #173ac3;
}
.history-botton-item{
    display: flex;
    align-items: center;
}
.history-line{
    border-left:1px solid #dcdfe6;
    height: 22px;
    width: 5px;
    margin-left: 5px;
}
.history-time{
    display: flex;
    align-items: flex-end;
    height: 22px;
    padding-left: 8px;
}
</style>