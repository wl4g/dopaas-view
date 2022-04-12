<template>
    <section>
        <el-row :gutter="20">
            <el-col :span="4">
                <el-menu class="custom-menu-demo" :default-active="activeIndex" @select="handleSelect">

                    <template  v-for="(item,index) in treeData">
                        <el-menu-item v-if="!hasShowingChild(item)" :index="item.value">
                            <span>{{item.name}}</span>
                        </el-menu-item>

                        <el-submenu v-else :index="item.name">
                            <span  slot="title">{{item.name}}</span>

                            <el-menu-item  v-for='(child,cindex) in item.children'
                                           :key='child.value'
                                           :index="child.value">
                                <span>{{child.name}}</span>
                            </el-menu-item>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <component :is="componentId"></component>
            </el-col>
        </el-row>
    </section>
</template>


<script>
    import BucketWrapper from './BucketWrapper.js'

    export default BucketWrapper
</script>

<style scoped>

</style>

