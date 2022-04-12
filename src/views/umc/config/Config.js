import {transDate, getDay} from 'utils/'

export default {
    name: 'config3',
    data() {
        return {
            //查询条件
            searchParams: {

            },
            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,
            //弹窗表单
            saveForm: {
                id: '',
                collectId: '',
                group: '',
                environment: '',
                classify: '',
                templateId: '',
                contactGroupId: '',
                callbackUrl: '',
            },

            //create内的下拉数据
            groupData: [],
            envirData: [],
            instanceData: [],

            templates: [],
            contactGroups: [],

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],
        }
    },

    mounted() {

        this.getGroup();
        this.getData();
        this.allContactGroup();
        this.getTemplateByClassify();

    },

    methods: {

        onSubmit() {
            this.getData();
        },

        currentChange(i) {
            //this.loading = true;
            this.pageNum = i;
            this.getData();
        },

        addData() {
            this.cleanSaveForm();
            this.dialogVisible = true;
            this.dialogTitle = '新增';
        },

        // 获取列表数据
        getData() {
            this.$$api_umc_configList({
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    this.total = json.data.total;
                    this.tableData = json.data.records;
                }
            })
        },

        allContactGroup() {
            this.$$api_iam_groupList({
                data: {},
                fn: json => {
                    this.contactGroups = json.data;
                }
            })
        },

        getTemplateByClassify() {
            this.$$api_umc_getTemplateByClassify({
                data: {
                    classify: this.saveForm.classify
                },
                fn: json => {
                    this.templates = json.data.list;
                }
            })
        },

        cleanSaveForm() {
            this.saveForm.id = '';
            this.saveForm.collectId = '';
            this.saveForm.group = '';
            this.saveForm.environment = '';
            this.saveForm.classify = '';
            this.saveForm.templateId = '';
            this.saveForm.contactGroupId = '';
            this.saveForm.callbackUrl = '';
        },


        saveData() {
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    //this.dialogLoading = true;
                    this.$$api_umc_saveConfig({
                        data: this.saveForm,
                        fn: json => {
                            this.dialogVisible = false;
                            this.getData();
                            this.cleanSaveForm();
                        }
                    });
                }
            });
        },

        dataDetail(row) {
            if (!row.id) {
                return;
            }
            this.$$api_umc_configDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = json.data.alarmConfig;
                }
            });
            this.dialogVisible = true;
            this.dialogTitle = '编辑';
        },

        //获取实例名称
        getinstance() {
            var clusterId = this.saveForm.group;
            var environmentId = this.saveForm.environment;
            this.instanceData = [];

            if (environmentId == "" || clusterId == "" || clusterId == undefined|| environmentId == undefined) {
                return;
            }
            this.$$api_cmdb_instances({
                data: {
                    clusterId: clusterId,
                    envType: environmentId
                },
                fn: json => {
                    this.instanceData = json.data.instances;
                    //判断要不要清空选中
                    var needClean = true;
                    for (let i = 0; i < this.instanceData.length; i++) {
                        if (this.instanceData[i].id == this.saveForm.collectId) {
                            needClean = false;
                            break;
                        }
                    }
                    if (needClean) {
                        this.saveForm.collectId = '';
                    }
                }
            })
        },

        // 获取分组名称
        getGroup() {
            this.$$api_cmdb_clusters({
                fn: json => {
                    this.groupData = json.data.clusters;
                }
            })
        },

        delData(row) {
            if (!row.id) {
                return;
            }
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_umc_delConfig({
                    data: {
                        id: row.id,
                    },
                    fn: json => {

                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getData();
                    }
                })
            }).catch(() => {
                //do nothing
            });

        },


    }
}
