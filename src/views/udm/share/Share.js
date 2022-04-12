import global from "../../../common/global_variable";

export default {
    name: 'share',
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

            browseUrl: global.getBaseUrl(global.cmdb,false)+'/view/index.html',
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

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_udm_shareList({
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


        cancelShare(row) {
            if (!row.id) {
                return;
            }
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_udm_cancelShare({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.$message({
                            message: '取消分享成功',
                            type: 'success'
                        });
                        this.getData();
                    },
                })
            }).catch(() => {
                //do nothing
            });
        },

        getShareText(row){
            let shareText = '链接:'+this.browseUrl+"?code="+row.shareCode;
            if(row.passwd){
                shareText = shareText + ' 密码:' + row.passwd;
            }
            return shareText;
        },

        onCopySuccess(){
            this.$message({
                message: '复制成功',
                type: 'success'
            });
        },

        rowClick(row, event, column){
            this.$refs.tableDate.toggleRowExpansion(row);

        },

        formatExpireTime(row, column, cellValue, index){
            if(row.expireType===1){
                return '永久';
            }else{
                return row.expireTime;
            }
        },


    }
}


