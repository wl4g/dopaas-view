import MyEditor from '../dataDev/MonacoEeditor.vue'
import axios from 'axios'
import moment from 'moment'
export default {
    name: 'maintenance',
    components:{
        MyEditor
    },
    data() {
        return {
            formData:{
                dataName:'',
                type:''
            },
            searchData:{
                dataName:'',
                type:''
            },
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
            sqlCodes:"select * from table1 where name like '%明%'",
        }
    },

    mounted() {
        this.queryHistoryList()
    },

    methods: {
        queryHistoryList(){
            axios({
                url:'http://dopaas.wl4g.fat/static/maintenance.json',
                method:'get',
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then((data)=>{
                this.tableData = data.data.list
            })
        },
        onSubmit() {

        },
        currentChange() {

        },
        clickRollBACK(v) {
            console.info(v)
            let  resultId = Math.max(...this.tableData.map(x => x.id)) || 1
            let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            let params = {
                id:resultId+1,
                runStartTime : date,
                runEndTime : date,
                type : '回滚',
                dataName:v.dataName,
                runningSQL:v.runningSQL,
                creater:v.creater
            }
            this.tableData.unshift({...params})
        },
        closeDialog(){
        },
        sqlOnMounted(edit){
            console.info('1111',edit)
        },
        sqlOnCodeChange(value,event){
            // console.info(value,event)
            this.sqlCodes = value
        },
        runResult(){
            console.info(this.sqlCodes)
            
        },
        RunningResult(){
            let  resultId = Math.max(...this.tableData.map(x => x.id)) || 1
            let moment = require('moment');
            let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            console.info("replace",this.sqlCodes.replace(/\n/g," "))
            this.tableData.unshift({id:resultId+1,...this.formData,runningSQL:this.sqlCodes,runStartTime:date,runEndTime:date,creater:'root'})

            console.info(this.tableData[resultId].runningSQL)
        },
        deleteDataSourse(val){
            console.info(this.tableData.splice(this.tableData.findIndex(item => item.id === val.id), 1))
            console.info(this.tableData)
        },
        showDetail(v){
            console.info(v)
            this.sqlCodes = v.runningSQL
            this.formData={
                dataName:v.dataName,
                type:v.type
            }
            this.$refs.monacoEditor.initEditor(this.sqlCodes)
        },
        searchDataSourse(){
            console.info(this.searchData)
            let newSearchData = this.tableData
            console.info("lastSearchData:",newSearchData)
            if(this.searchData.type){
                newSearchData =newSearchData.filter(item=>this.searchData.type ==item.type)
            }
            if(this.searchData.dataName){
                newSearchData =newSearchData.filter(item=>this.searchData.dataName ==item.dataName)
            }
            this.tableData =newSearchData 
        }
    }
}
