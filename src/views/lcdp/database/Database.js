import {transDate, getDay} from 'utils/'
import de from "element-ui/src/locale/lang/de";

export default {
    name: 'database',
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
                type: '',
                host: '',
                port: '',
                database: '',
                username: '',
                password: '',
                remark: '',
            },
            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,
            tableData: [],
            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'blur' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                type: [
                    {required: true, message: 'DbType is requires', trigger: 'blur' },
                ],
                host: [
                    {required: true, message: 'DbHost is requires', trigger: 'blur' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                port: [
                    {required: true, message: 'DbPort is requires', trigger: 'blur' },
                ],
                database: [
                    {required: true, message: 'DbName is requires', trigger: 'blur' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                username: [
                    {required: true, message: 'DbUsername is requires', trigger: 'blur' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
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
            this.dialogTitle = 'Add';
        },

        openDataSourceEdit(row) {
            //TODO ??
            this.$router.push({ path: this.permitutil.getRoutePathByPermission('udc:codegen:database'), query: { id: row.id } })
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_lcdp_databaseList({
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
                name: '',
                type: '',
                host: '',
                port: '',
                database: '',
                username: '',
                password: '',
                remark: '',
            };
        },

        saveData() {
            this.dialogLoading = true;
            this.saveForm.hostId = this.searchParams.hostId;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_lcdp_saveDatabase({
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
            this.$$api_lcdp_databaseDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = json.data;
                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Edit';
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
                this.$$api_lcdp_delDatabase({
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

        testConnectDb(row) {
            if (!row || !row.id) {
                this.$$api_lcdp_testConnectDb({
                    data: this.saveForm,
                    fn: json => {
                        this.$message({
                            message: 'Connect Success',
                            type: 'success'
                        });
                    },
                });
            }else{
                this.$$api_lcdp_testConnectDb({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.$message({
                            message: 'Connect Success',
                            type: 'success'
                        });
                    },
                });
            }
        },



    }
}
