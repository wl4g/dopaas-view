<template>
    <el-row class="tac">
        <el-col>
            <div style="display: flex;align-items: center;justify-content: center; cursor:pointer">
                <i style="padding-right: 5px;font-size: 16px;" class="el-icon-arrow-left" @click="black"></i>
                <p style="font-size: 16px;color: #088fff;font-weight: bold;">cd-west1-k8s-1</p>
            </div>
            <el-menu
                @select="selectMenu"
                :default-active="currentIndexLight"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                text-color="#898989"
                active-text-color="#000000"
            >
                <div v-for="item in menuList" :key="item.path">
                    <!-- 没有子菜单 -->
                    <template v-if="item.children && item.children.length == 0">
                        <el-menu-item :index="item.path">
                            {{item.title}}
                        </el-menu-item>
                    </template>

                    <!-- 有子菜单 -->
                    <el-submenu v-else :index="item.path">
                        <template slot="title">
                            <i class="el-icon-caret-right"></i>
                            {{item.title}}
                        </template>

                        <template v-for="child in item.children">
                            <!-- 这里是类似递归循环 -->
                            <sidebar-item
                                v-if="child.children&&child.children.length>0"
                                :item="child"
                                :key="child.path"
                            />
                            <el-menu-item v-else :key="child.path" :index="child.path">
                                {{child.title}}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </div>
            </el-menu>
        </el-col>

    </el-row>
</template>


<script>
  export default {
    name:'clusterLeft',
    data(){
        return{
            currentIndexLight: 'clusterInfo',//当前激活菜单的 index  高亮显示
            arrIndex: [],
            menuList: [
                {
                    "path": "clusterInfo",     //菜单项所对应的路由路径
                    "title": "集群信息",     //菜单项名称
                    "children": []        //是否有子菜单，若没有，则为[]
                },
                {
                    "path": "nodeManagement",
                    "title": "节点管理",
                    "children": []
                },
                {
                    "path": "givingName",
                    "title": "命名空间与配额",
                    "children": []
                },
                {
                    "path": "workload",
                    "title": "工作负载",
                    "children": [
                        {
                            "path": "noStatus",
                            "title": "无状态",
                            "children": []
                        },
                        {
                            "path": "hasStatus",
                            "title": "有状态",
                            "children": []
                        },
                        {
                            "path": "daemonSet",
                            "title": "守护进程集",
                            "children": []
                        },
                        {
                            "path": "task",
                            "title": "任务",
                            "children": []
                        },
                        {
                            "path": "timedTask",
                            "title": "定时任务",
                            "children": []
                        },
                        {
                            "path": "containerGroup",
                            "title": "容器组",
                            "children": []
                        },
                        {
                            "path": "customResource",
                            "title": "自定义资源",
                            "children": []
                        },
                    ]
                },
                {
                    "path": "net",
                    "title": "网络",
                    "children": []
                },
                {
                    "path": "net1",
                    "title": "配置管理",
                    "children": []
                },
                {
                    "path": "net2",
                    "title": "存储",
                    "children": []
                },
                {
                    "path": "net3",
                    "title": "应用",
                    "children": []
                },
                {
                    "path": "net4",
                    "title": "网络",
                    "children": []
                },
                {
                    "path": "net5",
                    "title": "配置管理",
                    "children": []
                },
                {
                    "path": "net6",
                    "title": "存储",
                    "children": []
                },
                {
                    "path": "net7",
                    "title": "应用",
                    "children": []
                },
            ]
        }
    },
    computed:{

    },
    methods: {
        handleOpen(key, keyPath) {
            
        },
        handleClose(key, keyPath) {
            
        },
        selectMenu(key, keyPath) {
            console.log(key, keyPath)
            this.currentIndexLight = key;
            this.$emit('leftSelect',key)
        },
        black(){
            this.$emit('isback',true)
        }
    }
  }
</script>
<style scoped>
.tac{
    max-height: 89vh;
    overflow-y: auto;
}
.el-menu-vertical-demo .el-menu-item:focus,
.el-menu-vertical-demo .el-menu-item:hover,
.el-menu-vertical-demo .el-menu-item.is-active {
    background-color: #DEDEDE;
}
</style>