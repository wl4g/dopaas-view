import bucket from './bucket/index'
import bucketSetting from './setting/index'
import bucketTest from './test/index'

export default {
    name: 'bucketWrapper',
    components: {
        bucket,
        bucketSetting,
        bucketTest
    },
    data() {
        return {
            activeIndex: '',
            treeData: [],
            componentId: ''
        }
    },

    mounted() {
        // 测试数据
        this.treeData = [
            {
                name: 'Bucket管理',
                children: null,
                value: 'bucket',
            },
            {
                name: '设置',
                children: null,
                value: 'bucketSetting',
            },
            {
                name: '测试',
                children: [
                    {
                        name: '测试1-1',
                        value: 'bucketTest',
                    }
                ]
            }
        ]

        this.$nextTick(function(){
            this.activeIndex =  this.treeData[0].value
            this.componentId = this.treeData[0].value
        })
    },

    methods: {
        hasShowingChild(item){
            if(!item.children){
                return false
            }

            return true
        },

        handleSelect(key, keyPath){
            this.componentId = key;
        }

    }
}
