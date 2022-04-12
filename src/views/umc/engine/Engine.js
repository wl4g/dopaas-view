import {transDate, getDay} from 'utils/'

export default {
    name: 'engine',
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

            tableData: [],
            loading: false
        }
    },

    activated() {
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
            this.$router.push({path: this.permitutil.getRoutePathByPermission('umc:custom:engine:edit')})
        },

        editData(row) {
            if (!row.id) {
                return;
            }
            this.$router.push({path: this.permitutil.getRoutePathByPermission('umc:custom:engine:edit'),query: {id:row.id}})
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_umc_engineList({
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

        delData(row) {
            if (!row.id) {
                return;
            }
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_umc_delEngine({
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
