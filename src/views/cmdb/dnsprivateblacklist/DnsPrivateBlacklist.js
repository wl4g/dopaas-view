import {transDate, getDay} from 'utils/'

export default {
    name: 'host',
    data() {
        return {
            //查询条件
            searchParams: {
                expression: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //弹窗表单
            saveForm: {
                id: '',
                expression: '',
                type: '',
                remark: '',
                enable: 1,
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            // 表单规则
            rules: {
                expression: [
                    {required: true, message: 'Please Input name', trigger: 'blur' },
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
            this.pageNum = i;
            this.getData();
        },

        addData() {
            this.cleanSaveForm();
            this.dialogVisible = true;
            this.dialogTitle = 'Add Host Netcard information';
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_cmdb_dnsPrivateBlacklistList({
                data: {
                    name: this.searchParams.name,
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
                expression: '',
                type: '',
                remark: '',
                enable: 1,
            };
        },

        saveData() {
            this.dialogLoading = true;
            this.saveForm.hostId = this.searchParams.hostId;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_cmdb_saveDnsPrivateBlacklist({
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
            this.cleanSaveForm();
            this.$$api_cmdb_dnsPrivateBlacklistDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = json.data;
                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Configure Host NetCard';
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
                this.$$api_cmdb_delDnsPrivateBlacklist({
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
                })
            }).catch(() => {
                //do nothing
            });
        },

        back(){
            this.$router.push({ path: this.permitutil.getRoutePathByPermission('cmdb:dnsprivatedomain') })
        }




    }
}
