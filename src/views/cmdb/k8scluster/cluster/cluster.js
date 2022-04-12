
import clusterMenu from './clusterMenu/clusterMenu.vue'
export default {
    name: 'cluster',
    components: {
        clusterMenu
    },
    data(){
        return {
            showMenu:false,
            options: [{
                value: '1',
                label: '查看当前集群与节点配额'
              }, {
                value: '2',
                label: '查看当前集群与节点配额1'
              }, {
                value: '3',
                label: '查看当前集群与节点配额2'
            }],
            value: '1',
            searchOptions: [{
                value: '1',
                label: '名称'
              }],
            searchValue: '1',
            tableData:[
                {
                    id:'c418970c6bcd14e358c6c3cebe029256c',
                    name:'cd-west1-k8s-1'
                }
            ]
        }
    },
    methods:{
        linkTo(){
            this.showMenu = !this.showMenu
            this.$store.dispatch('set_menu_close' )
        },
        isback(){
            this.showMenu =false
            this.$store.dispatch('set_menu_open')
        }
    }
}