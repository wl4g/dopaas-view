
import newSelect from './select.vue'

export default {
    name: 'overview',
    components: {
        newSelect
    },
    data() {
        return {
            dataList: [{
                name: '升级集群'
            }, {
                name: '升级系统组件'
            }],
            labelProperty:'name',
            resourceList:[
                {
                    name:'专业版集群数量',
                    value:'1/50'
                },
                {
                    name:'托管版集群数量',
                    value:'20'
                },
                {
                    name:'Serverless 集群数量',
                    value:'20'
                },
                {
                    name:'单个集群内节点池数量',
                    value:'20'
                },
                {
                    name:'单个集群内节点数量',
                    value:'100'
                },
            ],
            historyList:[
                {
                    content:'金秋上云季，ACREE新客包月8.5折，包年8折！快去抢购吧',
                    time:'2021年9月6日13:57:28'
                },
                {
                    content:'九月一号开学季',
                    time:'2021年9月1日13:57:28'
                },
            ]
        }
    },

    mounted() {
        
    },

    methods: {
        change(val){
            console.info(val)
        }

    }
}
