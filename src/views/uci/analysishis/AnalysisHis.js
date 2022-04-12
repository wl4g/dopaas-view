import {transDate, getDay} from 'utils/'

export default {
    name: 'analysisHis',
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

        // 获取列表数据
        getData() {
            this.$$api_uci_analysisList({
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    this.total = json.data.total;
                    this.tableData = json.data.records;
                }
            })
        },

    }
}

