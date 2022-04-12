<template>
    <div class="right">
        <div class="title">
            <p>cd-west1-k8s-1</p>
            <div>
                <el-button>刷新</el-button>
                <el-button type="success">通过CloudShell管理集群</el-button>
            </div>
        </div>
        <div class="infoContent">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane
                    v-for="(item, index) in this.tabsData"
                    :key="index"
                    :label="item.labelName"
                    :name="item.name"
                >
                    <keep-alive>
                    <component :is="currentTabComponent"></component>
                    </keep-alive>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import overView from './clusterInfoModules/overView.vue'
import basicInformation from './clusterInfoModules/basicInformation.vue'
export default {
    name:'culsterInfo',
    components:{
        overView,basicInformation
    },
    data(){
        return{
            activeName:'overView',
            tabsData:[
                {
                    labelName:'概览',
                    name:'overView',
                },
                {
                    labelName:'基本信息',
                    name:'basicInformation',
                },
                {
                    labelName:'连接信息',
                    name:'third',
                },
                {
                    labelName:'集群资源',
                    name:'fourth',
                },
                {
                    labelName:'集群日志',
                    name:'fifth',
                },
            ],
            currentTabComponent:overView
        }
    },
    methods:{
        handleClick(tab, event) {
            this.currentTabComponent=tab.name;
        }
    }
}
</script>

<style scoped>
.right{
    padding-left: 20px;
}
.title{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.title p{
    font-size: 18px;
    font-weight: bold;
}
.infoContent{
    padding-top: 10px;
}
</style>