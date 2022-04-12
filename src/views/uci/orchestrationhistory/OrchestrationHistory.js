import {transDate, getDay} from 'utils/'
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';

export default {
    name: 'taskhis',
    data() {
        return {
            //查询条件
            searchParams: {
                runId: '',
            },
            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //列表Data
            tableData: [],

            dictData: new Map(),

            loading: false,

            expandRowKeys: []


        }
    },

    mounted() {
        const dic = new Map();
        dic.set(1, "Hook");
        dic.set(2, "Manual");
        dic.set(3, "Rollback");
        this.dictData.set("ci_task_type", dic);

        const dic2 = new Map();
        dic2.set(0, "New");
        dic2.set(1, "Running");
        dic2.set(2, "Success");
        dic2.set(3, "Failed");
        dic2.set(4, "Timeout");
        this.dictData.set("ci_task_status", dic2);


    },

    activated() {
        this.getData();
    },

    methods: {
        onSubmit() {
            this.getData();
        },

        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },

        startRefreshList(){
            this.stopRefreshList();
            let that = this;
            if(this.checkExistRunningTask()){
                this.refreshListThread = self.setTimeout(function () {
                    that.getData();
                }, 1 * 3000);
            }
        },

        checkExistRunningTask(){
            if(this.tableData){
                for (var i in this.tableData) {
                    let taskHis = this.tableData[i];
                    if(taskHis['status']==0||taskHis['status']==1){//status is create or running
                        return true;
                    }
                }
            }
            return false;
        },

        stopRefreshList(){
            window.clearTimeout(this.refreshListThread);
        },


        // 获取列表数据
        getData() {
            this.loading = true;
            let param = {
                pageNum: this.pageNum,
                pageSize:10,
                runId: this.searchParams.runId,
            }
            this.$$api_uci_orchestrationHistoryList({
                data: {
                    ...param
                },
                fn: json => {
                    this.loading = false;
                    this.total = json.data.total;
                    this.tableData = json.data.records;
                    this.startRefreshList();
                },
                errFn: () => {
                    this.loading = false;
                }
            })
        },

        getDate(startDate){
            let Y = startDate.getFullYear() + '-';
            let M = (startDate.getMonth()+1 < 10 ? '0'+(startDate.getMonth()+1) : startDate.getMonth()+1) + '-';
            let D = startDate.getDate() <10 ? '0'+(startDate.getDate()) : startDate.getDate();
            return Y+M+D;
        },

        //Dict convert
        getDatagridDict(category, cellValue) {
            var dictGroup = this.dictData.get(category);
            var result = dictGroup.get(cellValue);
            //TODO add format tag
            return result;
        },
        convertType(row, column, cellValue, index) {
            return this.getDatagridDict("ci_task_type", cellValue);
        },
        convertStatusValue(row){
            switch(row.status){
            case 0:
                return { img: 'static/images/state/gray_normal.png', text: 'New' };
            case 1:
                return { img: 'static/images/state/red_run.gif', text: 'Running' };
            case 2:
                return { img: 'static/images/state/green_ok.png', text: 'Success' };
            case 3:
                return { img: 'static/images/state/red_fail.png', text: 'Failed' };
            case 4:
                return { img: 'static/images/state/red_fail.png', text: 'Timeout' };
            case 5:
                return { img: 'static/images/state/red_fail.png', text: 'Stopped' };
            case 6:
                return { img: 'static/images/state/red_fail.png', text: 'Part Success' };
            case 7:
                return { img: 'static/images/state/red_fail.png', text: 'Stopping' };
            default:
                return '--';
            }
        },
        convertStatusType(row){
            if (row.status == 0) {
                return '#75a2f9';
            }
            if (row.status == 1) {
                return '#50bfff';
            }
            if (row.status == 2) {
                return '#44e88d';
            }
            if (row.status == 3) {
                return '#DC143C';
            }
            if (row.status == 4) {
                return '#dc9417';
            }
            if (row.status == 5) {
                return '#f77171';
            }
            if (row.status == 6) {
                return '#dc9417';
            }
            if (row.status == 7) {
                return '#f77171';
            }
            return '#DC143C';
        },

        detail(row) {
            this.$router.push({path: this.permitutil.getRoutePathByPermission('uci:pipehis:detail'),query: {id:row.id}})
        },

        stopTask(id){
            if(!id){
                return;
            }
            this.$confirm('Stop task confirm', {
                confirmButtonText: 'ok',
                cancelButtonText: 'cancel',
                type: 'info'
            }).then(() => {
                this.$$api_uci_stopTask({
                    data: {
                        pipeHisId: id,
                    },
                    fn: json => {
                        this.getData();
                    },
                })
            }).catch(() => {
                //do nothing
            });
        },

        formatDuring(mss) {
            let days = parseInt(mss / (1000 * 60 * 60 * 24));
            let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = parseInt((mss % (1000 * 60)) / 1000);
            let result = '';
            if(days){
                result = result+ days + "天"
            }
            if(hours){
                result = result+ hours + "小时"
            }
            if(minutes){
                result = result+ minutes + "分钟"
            }
            if(seconds){
                result = result+ seconds + "秒"
            }
            return result;
        },

    },


    //离开前清除定时任务
    beforeRouteLeave(to,from,next){
        this.stopRefreshList();
        next();
    },


}
