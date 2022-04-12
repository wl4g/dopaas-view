import {transDate, getDay} from 'utils/'

export default {
    name: 'cluster',
    data() {
        return {
            //查询条件
            searchParams: {
                clusterName: '',
                deployType: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            tableData: [],

            loading: false,
        }
    },

    activated() {
        this.getData();
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

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_cmdb_clusterList({
                data: {
                    clusterName: this.searchParams.clusterName,
                    deployType: this.searchParams.deployType,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    this.loading = false;
                    this.total = json.data.page.total;
                    this.tableData = json.data.list;
                },
                errFn: () => {
                    this.loading = false;
                }
            })
        },

        addData() {
            //TODO jump to detail page
            this.$router.push({path: this.permitutil.getRoutePathByPermission('cmdb:cluster:edit')})
        },

        editData(row) {
            //TODO jump to detail page
            this.$router.push({path: this.permitutil.getRoutePathByPermission('cmdb:cluster:edit'),query: {id: row.id}})
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
                this.$$api_cmdb_delCluster({
                    data: {
                        clusterId: row.id,
                    },
                    fn: json => {
                        this.$message({
                            message: 'del success',
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
