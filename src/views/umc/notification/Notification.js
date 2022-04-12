import {transDate, getDay} from 'utils/'

export default {
    name: 'notification',
    data() {
        return {
            //查询条件
            searchParams: {
                startDate: '',
                endDate: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //弹窗表单
            saveForm: {
                id: '',
                alarmTime: '',
                alarmNote: '',
                contacts: [],
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

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

        addData() {
            this.cleanSaveForm();
            this.dialogVisible = true;
            this.dialogTitle = '新增';
        },

        // 获取列表数据
        getData() {
            var start = '';
            var end = '';
            if(this.searchParams.startDate!=''){
                start = this.getDate(this.searchParams.startDate);
            }
            if(this.searchParams.endDate!=''){
                end = this.getDate(this.searchParams.endDate);
            }

            this.$$api_umc_notificationList({
                data: {
                    startDate: start,
                    endDate: end,

                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    this.total = json.data.page.total;
                    this.tableData = json.data.list;
                }
            })
        },

        getDate(startDate){
            let Y = startDate.getFullYear() + '-';
            let M = (startDate.getMonth()+1 < 10 ? '0'+(startDate.getMonth()+1) : startDate.getMonth()+1) + '-';
            let D = startDate.getDate() <10 ? '0'+(startDate.getDate()) : startDate.getDate();
            return Y+M+D;
        },

        cleanSaveForm() {
            this.saveForm = {};
        },

        dataDetail(row) {
            if (!row.id) {
                return;
            }
            this.$$api_umc_notificationDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = json.data.notification;
                    this.saveForm.contacts = json.data.notificationContacts;
                }
            })
            this.dialogVisible = true;
            this.dialogTitle = '编辑';
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

    }
}
