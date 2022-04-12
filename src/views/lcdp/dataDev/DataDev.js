// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import MyEditor from './MonacoEeditor'
import * as monaco from 'monaco-editor';//引入后需要重启项目
export default {
    name: 'dataDev',
    components:{
        MyEditor
    },
    data() {
        return {
            tableData: [{}],
            //查询条件
            searchParams: {
                name: '',
            },
            loading: false,
            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,
            MainTainDialogVisible: false,
            dialogTitle: '数据维护',
            dialogLoading: false,
            sqlCodes:"select areaname, id,from ysdsf select dsaflk",

            
        }
    },

    mounted() {

    },

    methods: {
        onSubmit() {

        },
        currentChange() {

        },
        clickMainTain(v) {
            let self = this;
            self.MainTainDialogVisible = true
        },
        closeDialog(){
        },
        sqlOnMounted(edit){
            this.jsEditor = edit;
        },
        sqlOnCodeChange(value,event){
            console.info(value,event)
        },
    }
}
