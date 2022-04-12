import {transDate, getDay} from 'utils/'

export default {
    name: 'pcm',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
                providerKind: '',
                authType: '',
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
                providerKind: '',
                authType: '',
                baseUrl: '',
                accessToken: '',
                username: '',
                password: '',
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],


            // 表单规则
            rules: {

                name: [
                    {required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                providerKind: [
                    { required: true, message: 'Please Input provider', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                authType: [
                    { required: true, message: 'Please select authType', trigger: 'change' },
                ],
                baseUrl: [
                    { required: true, message: 'Please select baseUrl', trigger: 'change' },
                    { min: 1, max: 255, message: 'length between 1 to 255', trigger: 'blur' }
                ],

            },
            loading: false
        }
    },

    mounted() {
        this.getData();

    },

    methods: {

        onSubmit() {
            this.currentPage= 1 
            this.pageNum = 1;
            this.getData();
        },

        currentChange(i) {
            //this.loading = true;
            this.pageNum = i;
            this.currentPage = i
            this.getData();
        },

        addData() {
            this.cleanSaveForm();
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Add PCM Information';
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_uci_pcmList({
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
                providerKind: '',
                authType: '',
                baseUrl: '',
                accessToken: '',
                username: '',
                password: '',
            };

        },

        saveData() {
            this.dialogLoading = true;

            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_uci_savePcm({
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
                }else {
                    this.dialogLoading = false;
                }
            });
        },

        editData(row) {
            if (!row.id) {
                return;
            }
            this.$$api_uci_pcmDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = {
                        id: json.data.id,
                        name: json.data.name,
                        providerKind: json.data.providerKind,
                        authType: json.data.authType.toString() || undefined,
                        baseUrl: json.data.baseUrl,
                        accessToken: json.data.accessToken,
                        username: json.data.username,
                        password: json.data.password,
                        organizationCode: json.data.organizationCode,
                    };
                }
            });
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Edit PCM Information';
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
                this.$$api_uci_delPcm({
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


    }
}
