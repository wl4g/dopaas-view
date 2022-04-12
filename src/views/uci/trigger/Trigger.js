import {transDate, getDay} from 'utils/'

export default {
    name: 'trigger',
    data() {
        return {

            //查询条件
            searchParams: {
                id: '',
                name: '',
                taskId: '',
                enable: '',
                startDate: '',
                endDate: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //弹窗表单
            saveForm: {
                id: '',
                taskId: '',
                providerKind: '',
                remark: '',
                enable: '1',
                type: '',
                cron: '',
                name: '',

                //other
                group: '',
                environment: '',
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            //create内的下拉数据
            ProjectData: [],
            groupData: [],
            envirData: [],
            instanceData: [],
            tasksData: [],

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

            checkResult: '',

            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                group: [
                    {type:'number', required: true, message: 'Plese select Group', trigger: 'change' },
                ],
                taskId: [
                    {type:'number', required: true, message: 'Plese select task', trigger: 'change' },
                ],
                type: [
                    {type:'number', required: true, message: 'Plese select type', trigger: 'change' },
                ],

            },
            loading: false
        }
    },

    mounted() {
        this.getData();
        this.getProject();
        this.getGroup();

    },

    methods: {

        onSubmit() {
            this.loading = true;
            this.getData();
        },

        //add
        addTrigger() {
            this.getProject();
            this.getGroup();

            this.cleanSaveForm();
            this.dialogVisible = true;
            this.dialogTitle = '新增';
            this.dialogLoading = false;
        },

        //edit
        editTrigger(row) {
            this.getProject();
            this.getGroup();
            if (!row.id) {
                return;
            }
            this.dialogVisible = true;
            this.dialogTitle = '编辑';
            this.dialogLoading = false;

            this.$$api_uci_triggerDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm.id = json.data.id;
                    this.saveForm.taskId = json.data.taskId;
                    this.saveForm.name = json.data.name;
                    this.saveForm.remark = json.data.remark;
                    this.saveForm.enable = json.data.enable;
                    this.saveForm.type = json.data.type;
                    this.saveForm.cron = json.data.cron;
                    this.saveForm.group = json.data.appClusterId;
                    this.saveForm.organizationCode = json.data.organizationCode;
                }
            })
        },

        currentChange(i) {
            //this.loading = true;
            this.pageNum = i;
            this.getData();
        },

        // 获取列表数据
        getData() {
            var start = '';
            var end = '';
            if(this.searchParams.startDate!=''){
                start = this.getDate(this.searchParams.startDate);
            }
            if(this.searchParams.endDate!=''){
                end = this.getDate(this.searchParams.endDate);
            }

            this.$$api_uci_triggerList({
                data: {
                    id: this.searchParams.id,
                    name: this.searchParams.name,
                    taskId: this.searchParams.taskId,
                    enable: this.searchParams.enable,
                    startDate: start,
                    endDate: end,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    this.loading = false;
                    this.total = json.data.total;
                    this.tableData = json.data.records;
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

        // 获取分组名称
        getProject() {
            this.$$api_uci_getProjectBySelect({
                data: {
                    isBoot: 1
                },
                fn: json => {
                    this.ProjectData = json.data.list;
                }
            })
        },

        saveTrigger() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_uci_saveTrigger({
                        data: {
                            id: this.saveForm.id,
                            appClusterId: this.saveForm.group,
                            taskId: this.saveForm.taskId,
                            name: this.saveForm.name,
                            remark: this.saveForm.remark,
                            enable: this.saveForm.enable,
                            type: this.saveForm.type,
                            cron: this.saveForm.cron,
                        },
                        fn: json => {
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.getData();
                            this.cleanSaveForm();
                        },
                        errFn: ()=> {
                            this.dialogLoading = false;
                        }
                    })
                } else {
                    this.dialogLoading = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        cleanSaveForm() {
            this.saveForm.id = '';
            this.saveForm.group = '';
            this.saveForm.taskId = '';
            this.saveForm.name = '';
            this.saveForm.remark = '';
            this.saveForm.enable = '1';
            this.saveForm.group = '';
            this.saveForm.environment = '';

            this.saveForm.type = '';
            this.saveForm.cron = '';
        },

        delTrigger(row) {
            if (!row.id) {
                return;
            }
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_uci_delTrigger({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.getData();
                    }
                })
            }).catch(() => {
                //do nothing
            });

        },

        // 获取分组名称
        getGroup() {
            this.$$api_cmdb_clusters({
                fn: json => {
                    this.groupData = json.data.clusters;
                }
            })
        },


        checkCron() {
            this.$$api_uci_checkCron({
                data: {
                    expression: this.saveForm.cron,
                    numTimes: 5,
                },
                fn: json => {
                    if (json.data.validExpression) {
                        this.checkResult = json.data.nextExecTime;
                    } else {
                        this.checkResult = 'Expression unvalid';
                    }
                }
            })
        },


        getPipesByAppClusterId() {
            if(!this.saveForm.group){
                return;
            }
            this.$$api_uci_getPipesByAppClusterId({
                data: {
                    clusterId: this.saveForm.group,
                },
                fn: json => {
                    this.tasksData = json.data;
                },
            })
        },

        convertType(row) {
            if (row.type == 4) {
                return '调度';
            }
            if (row.type == 1) {
                return '钩子';
            }
            return '--';
        },

        convertEnableValue(row){
            if (row.enable == 0) {
                return '停用';
            }
            if (row.enable == 1) {
                return '启用';
            }

        },

        convertEnableType(row){
            if (row.enable == '0') {
                return 'danger';
            }
            if (row.enable == '1') {
                return 'success';
            }
            return 'warning';
        },

        gotoCluster(){
            this.dialogVisible = false;
            this.$router.push({ path: this.permitutil.getRoutePathByPermission('cmdb:cluster')})
        }
    }
}
