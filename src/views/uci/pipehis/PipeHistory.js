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
                groupName: '',
                pipeName: '',
                branchName: '',
                startDate: '',
                endDate: '',
                envType: '',
            },
            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,
            //弹窗表单
            buildForm: {
                group: '',
                environment: '',
                instances: [],
                branch: '',
                desc: '',
                providerKind: '',
                tagOrBranch: '1',
            },
            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            //create内的下拉数据
            groupData: [],
            envirData: [],
            instanceData: [],
            branchs: [],

            //列表Data
            tableData: [],

            //字典
            dictData: new Map(),

            //详情
            detailVisible: false,
            detailForm: {
                group: '',
                branch: '',
                taskInstances: [],
                result: ''
            },

            startPos: 0,
            logThread: 0,
            refreshListThread: 0,

            term: null,
            loading: false,
            //searchAddon: null,

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
        //alert("into activated");
        this.getData();
        //this.startRefreshList();
    },

    methods: {
        onSubmit() {

            this.getData();
        },
        create() {
            this.dialogVisible = true;
            this.dialogTitle = '新增';
        },
        currentChange(i) {
            //this.pageNum = i;
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
            this.$$api_uci_pipeHisList({
                data: {
                    clusterName: this.searchParams.groupName,
                    pipeName: this.searchParams.pipeName,
                    branchName: this.searchParams.branchName,
                    startDate: this.searchParams.startDate,
                    endDate: this.searchParams.endDate,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    environment: this.searchParams.envType,
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

        /*getDate(startDate){
            let Y = startDate.getFullYear() + '-';
            let M = (startDate.getMonth()+1 < 10 ? '0'+(startDate.getMonth()+1) : startDate.getMonth()+1) + '-';
            let D = startDate.getDate() <10 ? '0'+(startDate.getDate()) : startDate.getDate();
            return Y+M+D;
        },*/

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
        //双击
        doubleClickRow(row, column, event) {
            this.$router.push({path: this.permitutil.getRoutePathByPermission('uci:pipehis:detail'),query: {id:row.id}})
        },
        detail(row) {
            this.doubleClickRow(row);
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

        cleanBuildForm() {
            this.buildForm.group = '';
            this.buildForm.instances = [];
            this.buildForm.branch = '';
            this.buildForm.providerKind = '';
        },
        rollbackTask(row, column, event) {
            this.$confirm('回滚操作, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                this.$$api_uci_rollbackPipeHis({
                    data: {
                        pipeHisId: row.id,
                    },
                    fn: json => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.getData();
                    }
                })
            }).catch(() => {

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
