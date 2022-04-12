import {transDate, getDay} from 'utils/'

export default {
    name: 'repository',
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

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                providerKind: '',
                authType: '',
                baseUri: '',
                sshKeyPub: '',
                sshKey: '',
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
                    { required: true, message: 'Please Input providerKind', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                authType: [
                    { required: true, message: 'Please select authType', trigger: 'change' },
                ],
                baseUri: [
                    { required: true, message: 'Please select baseUri', trigger: 'change' },
                    { min: 1, max: 255, message: 'length between 1 to 255', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: 'Please Input username', trigger: 'change' },
                ],
                password: [
                    { required: true, message: 'Please Input password', trigger: 'change' },
                ],
                sshKey: [
                    { required: true, message: 'Please Input sshKey', trigger: 'change' },
                ],
                accessToken: [
                    { required: true, message: 'Please Input accessToken', trigger: 'change' },
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
            this.getData();
        },

        currentChange(i) {
            //this.loading = true;
            this.pageNum = i;
            this.getData();
        },

        addData() {
            this.cleanSaveForm();
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Add VCS information';
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_urm_vcsList({
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
                baseUri: '',
                sshKeyPub: '',
                sshKey: '',
                accessToken: '',
                username: '',
                password: '',
            };

        },

        saveData() {
            this.dialogLoading = true;

            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_urm_saveVcs({
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
            this.$$api_urm_vcsDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = {
                        id: json.data.id,
                        name: json.data.name,
                        providerKind: json.data.providerKind,
                        authType: json.data.authType.toString(),
                        baseUri: json.data.baseUri,
                        sshKeyPub: json.data.sshKeyPub,
                        sshKey: json.data.sshKey,
                        accessToken: json.data.accessToken,
                        username: json.data.username,
                        password: json.data.password,
                    };
                }
            });
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Configure VCS information';
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
                this.$$api_urm_delVcs({
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

        vcsManager(row){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('urm:project'),query: {id:row.id}})
        },


    }
}
