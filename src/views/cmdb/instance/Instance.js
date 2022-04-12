import {transDate, getDay} from 'utils/'

export default {
    name: 'host',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
                clusterId: '',
                envType: '',
                deployType: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                clusterId: '',
                envType: '',
                deployType: '',
                hostId: '',
                hosts: [],
                k8sId: '',
                dockerId: '',
                cossRefBucket: '',
                enable: 1,
                remark: ''
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            hosts: [],
            clusters: [],
            k8ss: [],
            dockers: [],
            cossBuckets: [],
            isEdit: false,

            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'blur' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                clusterId: [
                    {required: true, message: 'Please Select Cluster', trigger: 'blur' },
                ],
                hostId: [
                    {required: true, message: 'Please Select Host', trigger: 'blur' },
                ],
            },
            loading: false
        }
    },

    activated() {
        this.searchParams.clusterId = this.$route.query.clusterId;
        this.searchParams.envType = this.$route.query.envType;
        this.getData();
    },

    mounted() {
        this.searchParams.clusterId = this.$route.query.clusterId;
        this.searchParams.envType = this.$route.query.envType;
        this.getData();
        this.allHost();
        this.getClusters();
        this.getK8ss();
        this.getDockers();
        //coss 服务不见了
        //this.listBucketsWithProvider();
    },

    methods: {

        onSubmit() {
            this.pageNum = 1;
            this.getData();
        },

        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },

        addData() {
            this.cleanSaveForm();
            this.isEdit = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Add';
            if(this.searchParams.clusterId){
                this.saveForm.clusterId = this.searchParams.clusterId;
            }
            if(this.searchParams.envType){
                this.saveForm.envType = this.searchParams.envType;
            }
            this.onChangeCluster();
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_cmdb_instanceList({
                data: {
                    name: this.searchParams.name,
                    clusterId: this.searchParams.clusterId,
                    envType: this.searchParams.envType,
                    deployType: this.searchParams.deployType,
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
                clusterId: '',
                envType: '',
                deployType: '',
                hostId: '',
                hosts: [],
                k8sId: '',
                dockerId: '',
                cossRefBucket: '',
                sshId: '',
                endpoint: '',
                enable: 1,
                remark: ''
            };
        },

        saveData() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_cmdb_saveInstance({
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
            this.isEdit = true;
            this.$$api_cmdb_instanceDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    if(!json.data.hosts){
                        json.data.hosts = [];
                    }
                    this.saveForm = json.data;
                    if(this.saveForm.deployType){
                        this.saveForm.deployType = this.saveForm.deployType.toString();
                    }

                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Edit';
        },

        allHost() {
            this.$$api_cmdb_allHost({
                data: {},
                fn: json => {
                    if(json.data){
                        this.hosts = json.data;
                    }
                },
            });
        },

        onChangeCluster(){
            if(!this.saveForm.clusterId){
                return;
            }
            this.$$api_cmdb_clusterDetail({
                data: {
                    id: this.saveForm.clusterId,
                },
                fn: json => {
                    if(json.data){
                        this.saveForm.deployType = json.data.deployType;
                    }
                },
            });
        },

        getClusters() {
            this.$$api_cmdb_clusters({
                data: {},
                fn: json => {
                    if(json.data){
                        this.clusters = json.data.clusters;
                    }
                },
            });
        },

        getK8ss() {
            this.$$api_cmdb_getK8sForSelect({
                data: {},
                fn: json => {
                    if(json.data){
                        this.k8ss = json.data;
                    }
                },
            });
        },

        getDockers() {
            this.$$api_cmdb_getDockerForSelect({
                data: {},
                fn: json => {
                    if(json.data){
                        this.dockers = json.data;
                    }
                },
            });
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
                this.$$api_cmdb_delInstance({
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

        listBucketsWithProvider(){
            this.$$api_uos_listBucketsWithProvider({
                data: {},
                fn: json => {
                    this.cossBuckets = json.data;
                },
            })
        }



    }
}
