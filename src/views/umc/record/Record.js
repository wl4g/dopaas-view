import {transDate, getDay} from 'utils/'

export default {
    name: 'record',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
                startDate: '',
                endDate: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],


            saveForm: {
                alarmTemplate: {},

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

        // 获取列表数据
        getData() {
            var start = '';
            var end = '';
            if(this.searchParams.startDate && this.searchParams.startDate!=''){
                start = this.getDate(this.searchParams.startDate);
            }
            if(this.searchParams.endDate && this.searchParams.endDate!=''){
                end = this.getDate(this.searchParams.endDate);
            }
            this.loading = true;

            this.$$api_umc_recordList({
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

        timestampToTime(row, column, cellValue) {
            var date = new Date(cellValue); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            return Y + M + D + h + m + s;
        },

        convertStatusValue(value){
            if (value == 0) {
                return 'send';
            }
            if (value == 1) {
                return 'unsend';
            }
            if (value == 2) {
                return 'accepted';
            }
            if (value == 3) {
                return 'unaccepted';
            }
            return '--';
        },

        getDate(startDate){
            let Y = startDate.getFullYear() + '-';
            let M = (startDate.getMonth()+1 < 10 ? '0'+(startDate.getMonth()+1) : startDate.getMonth()+1) + '-';
            let D = startDate.getDate() <10 ? '0'+(startDate.getDate()) : startDate.getDate();
            return Y+M+D;
        },

        detail(row) {
            if (!row.id) {
                return;
            }
            this.$$api_umc_recordDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = json.data.alarmRecord;
                    this.saveForm.createTime = this.timestampToTime(null, null, this.saveForm.createTime);
                }
            });

            this.dialogVisible = true;
            this.dialogTitle = '编辑';
        },

    }
}
