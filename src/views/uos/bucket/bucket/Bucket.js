import {transDate, getDay} from 'utils/'

export default {
    name: 'bucket',
    data() {
        return {
            //查询条件
            searchParams: {
                prefix: '',
                cossProvider: 'minio',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            tableData: [],

            loading: false,

            dialogVisible: false,
            saveForm: {
                cossProvider: 'minio',
                bucketName: '',
            },

            cossProviders:[],

            // 表单规则
            rules: {
                bucketName: [
                    {required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                cossProvider: [
                    { required: true, message: 'Please select cossProvider', trigger: 'change' },
                ],

            },

            aclDialog: false,
            aclForm: {
                bucketName: '',
                acl: '',
                realAcl: '',
                config: '',
            },


        }
    },

    mounted() {
        this.getData();
        this.getCossProviders();
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

        cleanForm() {
            this.saveForm = {
                cossProvider: 'minio',
                bucketName: '',
            }
        },

        openSaveForm() {
            this.cleanForm();
            this.dialogVisible = true;
        },

        // 获取列表数据
        getData() {
            this.$$api_uos_listBuckets({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    prefix: this.searchParams.prefix,
                    marker: null,//TODO
                    maxKeys: 10,
                }, fn: json => {
                    this.tableData = json.data.bucketList;
                }
            });
        },

        detail(row) {
            this.$router.push({path: this.permitutil.getRoutePathByPermission('coss:bucket:detail'), query: {cossProvider: this.searchParams.cossProvider, bucketName: row.name,}})
        },

        createBucket() {
            this.$$api_uos_createBucket({
                data: this.saveForm,
                fn: json => {
                    this.$message({
                        type: 'success',
                        message: 'Success'
                    });
                    this.getData();
                    this.dialogVisible = false;
                }
            });
        },

        dateFormat(row, column) {
            var moment = require('moment');
            var date = row[column.property];
            if (!date || date === 0) {
                return "";
            }
            return moment(date).format("YYYY-MM-DD HH:mm:ss")
        },

        deleteBucket(row) {
            this.$confirm('confirm?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$$api_uos_deleteBucket({
                    data: {
                        cossProvider: this.searchParams.cossProvider,
                        bucketName: row.name,
                    }, fn: json => {
                        this.$message({
                            type: 'success',
                            message: 'Success'
                        });
                        this.getData();
                    }
                });
            }).catch(() => {

            });
        },

        getCossProviders(){
            this.$$api_uos_getCossProviders({
                data: {},
                fn: json => {
                    this.cossProviders = json.data;
                }
            });
        },


        getAcl(row){
            this.aclForm = {
                bucketName: row.name,
                acl: '',
                realAcl: '',
                config: '',
            },
                this.$$api_uos_getBucketAcl({
                    data: {
                        cossProvider: this.searchParams.cossProvider,
                        bucketName: row.name,
                    }, fn: json => {
                        this.aclForm.acl = json.data.acl;
                        this.aclForm.realAcl = json.data.realAcl;
                        this.aclForm.config = json.data.config;
                        this.aclDialog = true;
                    }
                });
        },

        setAcl(){
            this.$$api_uos_setBucketAcl({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    bucketName: this.aclForm.bucketName,
                    acl: this.aclForm.acl,
                }, fn: json => {
                    this.aclDialog = false;
                }
            });
        },

        resetBucketAcl(row) {
            this.$confirm('confirm?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$$api_uos_resetBucketAcl({
                    data: {
                        cossProvider: this.searchParams.cossProvider,
                        bucketName: row.name,
                    }, fn: json => {
                        this.aclDialog = false;
                    }
                });
            }).catch(() => {

            });
        },


    }
}
