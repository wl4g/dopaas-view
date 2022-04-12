import {transDate, getDay} from 'utils/'

export default {
    name: 'mysqlDataSource',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
            },

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


        }
    },

    activated() {
        this.getDataSourceProvides();
        this.cleanSaveForm();
        this.saveForm.id = this.$route.query.id;
        if(this.saveForm.id){
            this.isEdit = true;
            this.editData(this.saveForm.id);
        }
    },

    methods: {
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
                            this.cleanSaveForm();
                            this.back();
                        },
                    });
                }else {
                    this.dialogLoading = false;
                }
            });
        },

        editData(id) {
            if (!id) {
                return;
            }
            this.$$api_umc_dataSourceDetail({
                data: {
                    id: id,
                },
                fn: json => {
                    this.saveForm = json.data;
                }
            });
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Edit DataSource Information';
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

        back(){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('umc:custom:datasource')})
        },

    }
}
