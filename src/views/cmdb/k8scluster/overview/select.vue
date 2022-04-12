<template>
    <div class="zq-drop-list" @mouseover="onDplOver($event)" @mouseout="onDplOut($event)">
        <span><i class="el-icon-arrow-down"></i>{{dplLable}}</span>
        <ul v-dpl class="zq-dpl">
            <li v-for="(item, index) in dataList" :key="index" @click="onLiClick(index, $event)">{{item[labelProperty]}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "DropDownList",
    data(){
        return {
            activeIndex:0
        }
    },
    props:{
        dataList:{
            type:Array,
            default(){
                return [
                    {name: "升级集群"},
                    {name: "选项二"}
                ]
            }
        },
        labelProperty:{
            type:String,
            default(){ return "name" }
        }
    },
    directives:{
        dpl:{
            bind(el){
                el.style.display = "none";
            }
        }
    },
    methods:{
        onDplOver(event){
           document.querySelector('.zq-dpl').style.display = "block";
        },
        onDplOut(event){
            document.querySelector('.zq-dpl').style.display = "none";
        },
        onLiClick(index){
            let path = event.path || (event.composedPath && event.composedPath()) //兼容火狐和safari
            path[1].style.display = "none";
            this.activeIndex = index;
            this.$emit("change", {
                index:index,
                value:this.dataList[index]
            })
        }
    },
    computed:{
        dplLable(){
            return this.dataList[this.activeIndex][this.labelProperty]
        }
    }
}
</script>


<style scoped lang="scss">
    .zq-drop-list{
        display: inline-block;
        min-width: 100px;
        position: relative;
        cursor: pointer;
        span{
            display: block;
            height: 30px;
            line-height: 30px;
            background: #f7f9fa;
            font-size: 14px;
            text-align: center;
            color: #333333;
            border-radius: 4px;
            i{
                padding-right:8px;
                margin-left: 6px;
                display: inline-block;
            }
        }
        ul{
            position: absolute;
            top: 30px;
            left: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: solid 1px #f7f9fa;
            border-radius: 4px;
            overflow: hidden;
            text-align: center;
            li{
                list-style: none;
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                border-bottom: solid 1px #f7f9fa;
                background: #ffffff;
            }
            li:last-child{
                border-bottom: none;
            }
            li:hover{
                background: #f7f9fa;
            }
        }
    }
</style>