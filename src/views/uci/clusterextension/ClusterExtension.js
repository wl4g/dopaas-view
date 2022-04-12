import { transDate, getDay } from 'utils/'

export default {
    name: 'clusterExtension',
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
                namespace: '',
                status: '1',
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            hosts: [],

            // 表单规则
            rules: {
                name: [
                    { required: true, message: 'Please Input name', trigger: 'blur' },
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
            this.pageNum=1
            this.getData();
        },

        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },

        addData() {
            this.cleanSaveForm();
            this.dialogVisible = true;
            this.dialogTitle = 'Add Docker Cluster';
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_uci_clusterExtensionList({
                data: {
                    clusterName: this.searchParams.name,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    for (let i in json.data.records) {
                        json.data.records[i]['defaultEnvO'] = json.data.records[i]['defaultEnv']
                        json.data.records[i]['defaultBranchO'] = json.data.records[i]['defaultBranch']
                    }

                    this.loading = false;
                    this.total = json.data.total;
                    this.tableData = json.data.records;
                },
                errFn: () => {
                    this.loading = false;
                }
            })
        },


        saveData(row) {
            this.$$api_uci_saveClusterExtension({
                data: {
                    id: row.id,
                    clusterId: row.clusterId,
                    defaultEnv: row.defaultEnv,
                    defaultBranch: row.defaultBranch,
                },
                fn: json => {
                    row.defaultEnvO = row.defaultEnv;
                    row.defaultBranchO = row.defaultBranch;
                    this.$message.success('修改成功！')
                    //this.getData();
                },
                errFn: () => {
                    this.dialogLoading = false;
                }
            });

        },
    }
}
