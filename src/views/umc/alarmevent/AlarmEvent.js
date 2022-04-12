import {transDate, getDay} from 'utils/'

export default {
    name: 'alarmEvent',
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
            this.$$api_umc_eventList({
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


    }
}
