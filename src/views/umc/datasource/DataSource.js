import {transDate, getDay} from 'utils/'

export default {
    name: 'dataSource',
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

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                provider: 'MYSQL',
                url: '',
                username: '',
                password: '',
            },

            dataSourceProviders: [],

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            connecting: false,


            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                provider: [
                    { required: true, message: 'Please select provider', trigger: 'change' },
                ],
                url: [
                    { required: true, message: 'Please input url', trigger: 'change' },
                ],
                username: [
                    { required: true, message: 'Please input username', trigger: 'change' },
                ],
                password: [
                    { required: true, message: 'Please input password', trigger: 'change' },
                ],
                datasourceProvider: [
                    { required: true, message: 'Please select datasourceProvider', trigger: 'change' },
                ],

            },
            loading: false,

            selectVisible: false,
            toAddForm:{
                datasourceProvider: '',
            },

        }
    },

    mounted() {
        this.getData();
        this.getDataSourceProvides();
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
            this.toAddForm.datasourceProvider = '';
            this.selectVisible = true;

            /*this.cleanSaveForm();
            this.dialogLoading = false;
            this.dialogVisible = true;*/
        },

        toAddData() {
            this.$refs['toAddForm'].validate((valid) => {
                if (valid) {
                    if(this.toAddForm.datasourceProvider === 'MYSQL'){
                        this.$router.push({path: this.permitutil.getRoutePathByPermission('umc:custom:datasource:edit')})
                    }
                    this.selectVisible = false;
                } else {

                }
            });
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_umc_dataSourceList({
                data: {
                    name: this.searchParams.name,
                    providerKind: this.searchParams.providerKind,
                    authType: this.searchParams.authType,
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
        cleanSaveForm() {
            this.saveForm = {
                id: '',
                name: '',
                provider: 'MYSQL',
                url: '',
                username: '',
                password: '',
            };
        },

        saveData() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    const json = JSON.stringify(this.saveForm);
                    this.$$api_umc_saveDataSource({
                        data: {
                            provider: this.saveForm.provider,
                            dataSource: json,
                        },
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
                }else {
                    this.dialogLoading = false;
                }
            });
        },

        editData(row) {
            if (!row.id) {
                return;
            }
            this.$router.push({path: this.permitutil.getRoutePathByPermission('umc:custom:datasource:edit'),query: {id:row.id}})
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
                this.$$api_umc_delDataSource({
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

        getDataSourceProvides() {
            this.$$api_umc_dataSourceProvides({
                data: {},
                fn: json => {
                    this.dataSourceProviders = json.data;
                },
            })
        },

        testConnect(){
            this.connecting = true;
            this.$$api_umc_testConnect({
                data: this.saveForm,
                fn: json => {
                    this.$message({
                        message: '连接成功',
                        type: 'success'
                    });
                    this.connecting = false;
                },
                errFn: json => {
                    this.$message.error(data.message);
                    this.connecting = false;
                }
            })
        },

    }
}
