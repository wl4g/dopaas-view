import { transDate, getDay } from 'utils/'
import global from "../../../common/global_variable";

export default {
    name: 'orchestration',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
            },
            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,
            currentPage:1,
            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                environment: '',
                type: '',
                remark: '',
                orchestrationPipelines: [],
            },
            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],
            pipelines: [],
            pipelinesShow: [],
            // 表单规则
            rules: {
                name: [
                    { required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
            },
            loading: false,
            //before create Build Task
            confirmDialog: false,
            confirmForm: {
                id: '',
                trackId: '',
                trackType: '',
                remark: '',

                userId: '',
                projectId: '',
                issueId: '',

                fileList: [],
                annex: '',
            },
            saveLoading: false,
            users: [],
            projects: [],
            issues: [],
            uploadUrl: global.getBaseUrl(global.uci, false) + '/fs/upload',
            buildRules: {
                trackType: [
                    { required: true, message: 'Please select trackType', trigger: 'change' },
                ],
                trackId: [
                    { required: true, message: 'Please input trackId', trigger: 'change' },
                ],
                remark: [
                    { required: true, message: 'Please input remark', trigger: 'change' },
                ],
            },
        }
    },

    mounted() {
        this.getData();
        this.getPipelines();
    },

    methods: {

        onSubmit() {
            this.pageNum = 1
            this.getData();
        },

        currentChange(i) {
            
            this.pageNum = i;
            this.getData();
        },

        addData() {
            this.getPipelines();
            this.cleanSaveForm();
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Add orchestration information';
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.currentPage = this.pageNum;
            this.searchParams.pageNum = this.pageNum;
            this.searchParams.pageSize = this.pageSize;
            this.$$api_uci_orchestrationList({
                data: this.searchParams,
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
        cleanSaveForm() {
            this.saveForm = {
                id: '',
                name: '',
                environment: '',
                type: '1',
                remark: '',
                orchestrationPipelines: [],
                organizationCode:undefined
            };
        },

        saveData() {
            this.dialogLoading = true;

            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_uci_saveOrchestration({
                        data: this.saveForm,
                        fn: json => {
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.getData();
                            this.cleanSaveForm();
                        },
                        errFn: () => {
                            this.dialogLoading = false;
                        }
                    });
                } else {
                    this.dialogLoading = false;
                }
            });
        },

        editData(row) {
            if (!row.id) {
                return;
            }
            this.getPipelines();
            this.$$api_uci_orchestrationDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = {
                        id: json.data.id,
                        name: json.data.name,
                        type: json.data.type.toString(),
                        remark: json.data.remark,
                        orchestrationPipelines: json.data.orchestrationPipelines,
                        organizationCode: json.data.organizationCode,
                    };

                    this.fixPipelinesShow();
                }
            });
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Configure Orchestration information';
        },


        delData(row) {
            if (!row.id) {
                return;
            }
            this.cleanSaveForm()
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_uci_delOrchestration({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getData();
                    },
                })
            }).catch(() => {
                //do nothing
            });
        },

        // 获取列表数据
        getPipelines() {
            this.$$api_uci_getPipelineForSelect({
                data: {
                    environment: this.saveForm.environment
                },
                fn: json => {
                    this.pipelines = json.data;
                    this.fixPipelinesShow();
                }
            })
        },


        fixPipelinesShow() {
            for (let i in this.saveForm.orchestrationPipelines) {
                this.buildPipelinesShow(this.saveForm.orchestrationPipelines[i]);
            }
        },

        buildPipelinesShow(orchestrationPipeline) {
            orchestrationPipeline.showPipelines = [];
            for (let i in this.pipelines) {
                if (this.isContainPipeline(this.pipelines[i].id)) {
                    if (this.pipelines[i].id == orchestrationPipeline.pipelineId) {
                        orchestrationPipeline.showPipelines.push(this.pipelines[i]);
                    }
                } else {
                    orchestrationPipeline.showPipelines.push(this.pipelines[i]);
                }
            }
        },

        isContainPipeline(pipelineId) {
            for (let i in this.saveForm.orchestrationPipelines) {
                if (this.saveForm.orchestrationPipelines[i].pipelineId == pipelineId) {
                    return true;
                }
            }
            return false;
        },

        runOrchestration(row) {
            this.$confirm('Continue to start Orchestration?', 'warning', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            }).then(() => {
                this.$$api_uci_runOrchestration({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.$message({
                            message: 'Success',
                            type: 'success'
                        });
                        this.getData();
                    },
                });
            }).catch(() => {
                //do nothing
            });
        },

        deleteRow(index) {
            this.saveForm.orchestrationPipelines.splice(index, 1);
            this.fixPipelinesShow()
        },

        addRow() {
            if (!this.saveForm.orchestrationPipelines) {
                this.saveForm.orchestrationPipelines = [];
            }
            this.saveForm.orchestrationPipelines.push({
                pipelineId: '',
                priority: '50',
            })
            this.fixPipelinesShow()
        },

        beforeRunTask(row) {
            this.cleanConfirm();
            if (!row.id) {
                return;
            }

            this.confirmForm.id = row.id;
            this.confirmForm.pcmId = row.pcmId;
            this.confirmForm.pcmEnable = row.pcmEnable;

            this.confirmDialogTitle = '构建[' + row.pipeName + ']';
            this.confirmDialog = true;

            this.saveLoading = false;

            this.getPcmSelect(row);
        },

        cleanConfirm() {
            this.confirmForm = {
                id: '',
                pcmId: '',
                pcmEnable: 1,

                trackId: '',
                trackType: '',
                remark: '',

                userId: '',
                projectId: '',
                issueId: '',
                //upload file
                fileList: [],
                annex: '',
            };
        },

        runTask() {
            this.saveLoading = true;
            this.$refs['confirmForm'].validate((valid) => {
                if (valid) {
                    this.$$api_uci_runOrchestration({
                        data: this.confirmForm,
                        fn: json => {
                            this.getData();
                            this.confirmDialog = false;
                            this.saveLoading = false;
                            this.$confirm('Success,jump to task list?', {
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No',
                                type: 'success'
                            }).then(() => {
                                this.$router.push(this.permitutil.getRoutePathByPermission('uci:orchestrationhistory'));
                            }).catch(() => {
                                //do nothing
                            });
                        },
                        errFn: () => {
                            this.saveLoading = false;
                        }
                    });
                } else {
                    this.saveLoading = false;
                }
            });
        },

        getPcmSelect(row) {
            this.getUsers();
            this.getProjects();
            this.getIssues();
        },
        getUsers() {
            this.$$api_uci_getUsers({
                data: {
                    pcmId: this.confirmForm.pcmId
                },
                fn: json => {
                    this.users = json.data;
                },
            })
        },
        getProjects() {
            this.$$api_uci_getPcmProjects({
                data: {
                    pcmId: this.confirmForm.pcmId
                },
                fn: json => {
                    this.projects = json.data;
                },
            })
        },
        getIssues() {
            this.$$api_uci_getIssues({
                data: {
                    pcmId: this.confirmForm.pcmId,
                    userId: this.confirmForm.userId,
                    projectId: this.confirmForm.projectId,
                },
                fn: json => {
                    this.issues = json.data;
                },
            })
        },
        uploadSuccess(response, file, fileList) {
            this.confirmForm.annex = response.data
        },
        uploadFail(err, file, fileList) {
            this.$message.error('upload fail');
        },

        getInstanceByIdCount(id) {
            for (let i in this.pipelines) {
                if (id === this.pipelines[i].id && this.pipelines[i]['instances']) {
                    return this.pipelines[i]['instances'].length;
                }
            }
            return '';
        }
    }
}
