<template>
    <el-row class="tac">
        <el-col :span="4">
            <clusterLeft @leftSelect='leftSelect' @isback ='isback'></clusterLeft>
        </el-col>
        <el-col :span="20">
            <component :is="currentView" />
        </el-col>
    </el-row>
</template>

<script>
import clusterLeft from './clusterLeft.vue'
import clusterInfo from './modules/clusterInfo.vue'
import givingName from './modules/givingName.vue'
export default {
    name:'clusterMenu',
    components:{
        clusterLeft,
        clusterInfo,
        givingName,
    },
    data(){
        return{
            currentView:clusterInfo
        }
    },
    methods:{
        leftSelect(payload){
            this.currentView = payload
        },
        isback(){
            this.$emit('isback',true)
        }
    }
}
</script>

<style scoped>
.content{
    width: 100%;
}
</style>