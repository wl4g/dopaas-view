<template>
    <div>
        <div class="contentTop">
            <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
                <el-form-item label="集群">
                    <el-select clearable v-model="searchParams.providerKind" disabled>
                        <el-option
                            v-for="item in dictutil.getDictListByType('vcs_provider')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="命名空间">
                    <el-select clearable v-model="searchParams.authType">
                        <el-option
                                v-for="item in dictutil.getDictListByType('vcs_auth_type')"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <i class="el-icon-refresh" @click="onSubmit" ></i>
                </el-form-item>
            </el-form>
            <div class="topRight">
                <p>Prometheus 监控</p>
                <div>
                    <div class="circle"></div><span style="color:#01e32a">运行中</span>
                </div>
            </div>
        </div>
        <div class="content-frist">
            <div class="fristMain">
                <el-card style="width:64%;height:290px">
                    <div class="fristMainTitle">应用状态</div>
                    <el-carousel height="250px" arrow="always" trigger="click" :autoplay='false' class="colWidth">
                        <el-carousel-item v-for="item in 2" :key="item">
                            <div style="display:flex;height:250px;width:100%" >
                                <div id="deployEchart" class="deployEchart"></div>
                                <div id="deployEchart1" class="deployEchart1"></div>
                                <div id="deployEchart2"></div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </el-card>
                <el-card style="width:35%;height:290px">
                        <div class="fristMainTitle">节点状态</div>
                        <div id="jiedianEcharts" class="jiedianEcharts" style="height:250px">
                            
                        </div>
                </el-card>
            </div>
            <div class="fristMain">
                <el-card style="width:100%;height:500px">
                    <div>123</div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:'overView',
    data(){
        return{
            searchParams:{},
            deployEcharts:null,
            deployEcharts1:null,
            deployOptions: {
                // 图形中间文字
                graphic: [ {
                    type: 'group',
                    id: 'textGroup2',
                    left: 'center',
                    top: 'center',
                    position :[10, 0],
                    children: [
                        {
                            type: 'text',
                            z: 100,
                            top: 'middle',
                            left: 100,
                            style: {
                                formatter: "{a} <br/>{b}: {c} ({d}%)",
                                text: [
                                    '15',
                                    '正常',
                                ].join('\n'),
                                font: '16px cursive',
                                textAlign: "center",
                                fill:'#13a7d1',
                            },
                        }
                    ]
                }],
                title: {
                    text: '部署',
                    left: 'center',
                    top: '12%',
                },
                tooltip: {
                    show:true,
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}"
                },
                legend: {
                    orient: 'vertical',
                    left: 'center',
                    bottom: '2%',
                    icon : 'circle',
                    textAlign: "center",
                    textStyle:{
                        rich: {
                            // 通过富文本rich给每个项设置样式，下面的normal、abnormal、number可以理解为"每一列"的样式
                            normal: {
                                // 设置正常这一列的样式
                                width: 30,
                                color: "#01e32a",
                                fontSize: 12,
                                fontWeight: "bolder",
                            },
                            abnormal: {
                                // 设置异常这一列的样式
                                width: 30,
                                color: "#ff9400",
                                fontSize: 12,
                                fontWeight: "bolder",
                            },
                            number: {
                                // 设置数量这一列的样式
                                width: 35,
                                color: "#333",
                                fontSize: 12,
                            },
                        },
                    },
                    formatter:  (name) => {
                        // formatter格式化函数动态呈现数据
                        let target;
                        for (let i = 0; i < this.deployOptions.series[0].data.length; i++) {
                            if (this.deployOptions.series[0].data[i].name == name) {
                                target = this.deployOptions.series[0].data[i].value;
                            }
                        }
                        return `${name == '正常' ? `{normal|${name}}` : `{abnormal|${name}}`}{number|${target}}`;
                        //      富文本第一列样式应用                                            富文本第二列样式应用
                    },
                },
                series: [
                    {
                        name: '部署',
                        type: 'pie',
                        // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
                        radius: ['45%', '50%'],
                        // 关闭防止标签重叠策略
                        avoidLabelOverlap: false,
                        color:['#01e32a','#ff9400'],
                        // 开启指示线
                        labelLine: {
                            show: false
                        },
                        data: [
                            {
                                value: 9,
                                name: '正常',
                                label: {
                                    // 单独显示该数据项
                                    show: false,
                                    fontSize: 15
                                }


                            },
                            {
                                value: 3,
                                name: '异常',
                                label: {
                                    // 单独显示该数据项
                                    show: false,
                                    fontSize: 15
                                }
                            },
                        ]
                    }
                ]
            },
            // stateCoryOptions :{
            //     color:['#5fb878','#eeeeee'],
            //     title:{
            //         text:'质量问题预警'
            //     },
            //     series: [
            //         {
            //             name: '访问来源',
            //             type: 'pie',
            //             radius: ['50%', '70%'],
            //             avoidLabelOverlap: false,
            //             hoverAnimation:false,   //关闭放大动画
            //             selectedOffset:0,     //选中块的偏移量
            //             label: {
            //                 show: false,
            //                 position: 'center',
            //                 formatter: '{d}%'
            //             },
            //             emphasis: {
            //                 label: {
            //                     show: true,
            //                     fontSize: '20',
            //                     fontWeight: 'bold'
            //                 }
            //             },
            //             labelLine: {
            //                 show: false
            //             },
            //             data: [
            //                 {    
            //                     value: 435,
            //                     name: '直接访问',
            //                     selected:true,     //默认选中第一块
            //                     label:{
            //                         show:true,     //默认显示第一块
            //                         fontSize: '20',
            //                         fontWeight: 'bold'
            //                     },
            //                     // itemStyle: {
            //                     //     normal: {
            //                     //         color: { // 完成的圆环的颜色
            //                     //             colorStops:[
            //                     //                 {
            //                     //                     offset: 0,
            //                     //                     color: '#02d6fc' // 0% 处的颜色
            //                     //                 }, 
            //                     //                 {
            //                     //                     offset: 1,
            //                     //                     color: '#367bec' // 100% 处的颜色
            //                     //                 }
            //                     //             ]
            //                     //         },
            //                     //         label: {
            //                     //             show: false
            //                     //         },
            //                     //         labelLine: {
            //                     //             show: false
            //                     //         }
            //                     //     }
            //                     // },
            //                 },
            //                 {value: 310, name: '邮件营销'},
            //             ]
            //         }
            //     ]
            // }
            stateCoryOptions:{
                title: {
                    text: 'sss',
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: '18'
                    }
                },
                color: ['#282c40'],
                legend: {
                    show: false,
                    data: []
                },
    
                series: [{
                    name: 'Line 1',
                    type: 'pie',
                    clockWise: true,
                    radius: ['55', '65'],//设置圆环的半径
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    hoverAnimation: false,
                    data: [{
                        value: '88.23',
                        name: '',
                        itemStyle: {
                            normal: {
                                color: { // 完成的圆环的颜色
                                    colorStops: [{
                                        offset: 0,
                                        color: 'blue' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: 'red' // 100% 处的颜色
                                    }]

                                },
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        }
                    }, {
                        name: '',
                        value: 100 - '88.23',
                    }]
                }]
            },
            option : {
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "0%",
                    containLabel: true
                },
                title: {
                    text: '正常:4',
                    left: 'center',
                    top: '12%',
                },
                series: [
                    {
                        name: "一般",
                        type: "pie",
                        //起始刻度的角度，默认为 90 度，即圆心的正上方。0 度为圆心的正右方。
                        startAngle: 0,
                        hoverAnimation: false,
                        tooltip: {},
                        radius: ["80%", "50%"],
                        center: ["50%", "75%"],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {
                                value: 300,
                                itemStyle: {
                                    normal: {
                                        color: "rgba(80,150,224,0)"
                                    }
                                }
                            },
                            {
                                value: 125,  // 渐变色部分
                                itemStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: "#FFDE00" },
                                        { offset: 0.5, color: "#00ECD9" },
                                        { offset: 1, color: "#00ECD9" }
                                    ])
                                },
                            },
                            {
                                value: 175, // 右侧部分
                                itemStyle: {
                                    normal: {
                                        color: "#0C5071"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    },
    computed:{
    },
    mounted(){
        let width = document.querySelector('.colWidth').getBoundingClientRect().width / 3 +'px'
        $(".deployEchart , .deployEchart1 , .deployEchart2").css("width", width).css("height", '250px');
        this.deployEcharts = echarts.init(document.getElementById('deployEchart'))
        this.deployEcharts.setOption(this.deployOptions)
        this.deployEcharts1 = echarts.init(document.getElementById('deployEchart1'))
        this.deployEcharts1.setOption(this.stateCoryOptions)
        echarts.init(document.getElementById('jiedianEcharts')).setOption(this.option)
    },
    methods:{
        onSubmit(){

        }
    }

}
</script>

<style>
.contentTop{
    display: flex;
    justify-content: space-between;
}
.circle{
    width: 10px;
    height: 10px;
    background-color: #01e32a;
    border-radius: 50%; 
    display: inline-block;
    margin-right: 5px;
}
.topRight{
    display: flex;
    justify-content: space-between;
}
.topRight p{
    padding-right:20px;
    color: #175de9;
}
.fristMain{
    display: flex;
    width:100%
}
.fristMain{
    width:100%;
    display: flex;
    justify-content: space-between;
}
.el-card__body{
    padding: 0 !important;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #ffffff;
}
.echarts {
  width: auto;
  height: 250px;
}
.fristMainTitle{
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    font-weight: bold;
    padding-left: 15px;
}
</style>