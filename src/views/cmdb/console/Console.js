import fa from "element-ui/src/locale/lang/fa";
import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import th from "element-ui/src/locale/lang/th";
import BottomPanel from '@/components/BottomPanel'

export default {
    name: 'console',
    components: {
        BottomPanel,
    },

    data() {
        return {
            formInline: {
                index: 'ems',
                loglevle: 3,
                fq: '5',
                content: '',
                enable: false
            },
            groupData: [],
            fq: [{value: '3'},
                {value: '5'},
                {value: '10'},
                {value: '15'},
                {value: '20'},
                {value: '25'}],
            loglevle: [{id: 5, value: 'ERROR ↑'},
                {id: 4, value: 'WARN ↑'},
                {id: 3, value: 'INFO ↑'},
                {id: 2, value: 'DEBUG ↑'},
                {id: 1, value: 'TRACE ↑'}],
            radio: 1,
            radio1: 1,
            //页
            total: 0,
            pageNum: 1,
            pageSize: 10,
            loading: true,
            excute: 'Start',
            excutestatus: false,
            // 弹窗刚开始关闭状态
            dialogVisible: false,
            historylog: false,
            falg: false,
            falg1: false,
            value1: new Date(),
            value2: new Date(),
            value3: new Date(),
            websocket: null,
            _timeOut: '',
            timeout: '',
            //textarea: "2018-11-14 13:13:18.496  INFO 4931  \r\n  --- [inner-job-com.sm.sink.service.xschedule.job.DeviceRealtimeEventWatchJob-2] c.s.s.service.rt.RealtimeStateWatcher    : Processing. addr=11111119, order=56/n2018-11-14 13:13:18.496  INFO 4931 --- [inner-job-com.sm.sink.service.xschedule.job.DeviceRealtimeEventWatchJob-2] c.s.s.service.rt.RealtimeStateWatcher    : Processing. addr=11111119, order=58",
            textarea: '',
            ruleForm: {
                desc: '',
            },
            rules: {
                desc: [
                    {required: true, message: '请填写详细描述', trigger: 'blur'}
                ]
            },
            // 默认显示一条空数据
            tableData1: [{
                enable: true,
                value: '',
            }],
            // 最大表格数据
            tableData: [],
            //0910add
            logThread: 0,//记录读取日志的线程
            logTimeStamp: new Date(),//已经读到哪个时刻的日志
            isFirst: true,

            lastReadTime: 0,

            term: null,
            i: 1,

        }
    },
    watch: {
        textarea() {
            this.scroll();
        }
    },
    mounted() {
        this.getGroup();
        let that = this;
        self.setTimeout(function () {
          that.createTerminal();
        }, 1 * 1000);
    },

    methods: {

        //2019-12-03modify
        createTerminal() {
            this.term = new Terminal({
                logLevel: 'debug',
                allowTransparency: true,
                fontSize: 12,
                rows: 38,
                fontFamily: 'courier-new,courier,monospace',
                //letterSpacing: 0,//文字间隔（px）
                theme: {background: '#121319'}
            });
            const fitAddon = new FitAddon();

            this.term.loadAddon(fitAddon);
            this.term.open(document.getElementById('terminal'));
            fitAddon.fit();
            //write
            //this.term.writeln('nothing now');
            //this.testData();


        },

        testData() {
            let that = this;
            self.setTimeout(function () {
                //that.term.clear();
                that.term.writeln('info =  ' + that.i);
                that.i = that.i + 1;
                that.testData();
            }, 1 * 200);
        },


        // 获取分组名称
        getGroup() {
            this.$$api_cmdb_clusters({
                fn: json => {
                    this.groupData = json.data.clusters;
                }
            })
        },


        querySearch(queryString, cb) {
            var fq = this.fq;
            var results = queryString ? fq.filter(this.createFilter(queryString)) : fq;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },

        createFilter(queryString) {
            return (fq) => {
                return (fq.value.indexOf(queryString.toLowerCase()) === 0);
            };
        },

        checkfq() {
            let fq = this.formInline.fq;
            if (!(/(^[0-9]*[1-9][0-9]*$)/.test(fq)) || fq < 2) {
                this.$message.error('Flush frequency should not be less than 2sec');
                this.formInline.fq = 5;
            }
        },

        //滚动
        scroll() {
            this.$nextTick(() => {
                let div = document.querySelector(".el-textarea__inner");
                div.scrollTop = div.scrollHeight;
            })

        },

        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        screen() {
            this.dialogVisible = true;
            if (this.tableData1.length == 1 && this.tableData1[0].value == "") {
                this.tableData1[0].value = this.formInline.content;
            }
        },
        confirm() {
            this.dialogVisible = false;
            this.formInline.enable = true;
        },
        submit() {
            //stop cron
            this.stopThread();
            this.cleanConsole();

            let start = null;
            let end = null;
            this.historylog = false;
            if (this.radio == 1) {
                //TODO
                end = new Date();
                if (this.radio1 == 1) {
                    start = new Date(end.valueOf() - 60 * 1000);//1min
                } else if (this.radio1 == 2) {
                    start = new Date(end.valueOf() - 15 * 60 * 1000);//15min
                } else if (this.radio1 == 3) {
                    start = new Date(end.valueOf() - 60 * 60 * 1000);//1hour
                } else if (this.radio1 == 4) {
                    start = new Date(end.valueOf() - 4 * 60 * 60 * 1000);//4hour
                } else {
                    alert("program is error");
                    return;
                }
            } else {
                let ymdDate = this.value1;
                let startDate = this.value2;
                let endDate = this.value3;
                let ymd = '';
                if (ymdDate != '') {
                    ymd = this.getDate1(ymdDate);
                }
                if (startDate != '' && ymd != '') {
                    start = ymd + " " + this.getDate2(startDate);
                }
                if (endDate != '' && ymd != '') {
                    end = ymd + " " + this.getDate2(endDate);
                }
            }
            start = new Date(start).getTime();
            end = new Date(end).getTime();

            let queryList = this.getQueryList();
            this.getlog(start, end, false, queryList, 1000)
        },

        getDate1(startDate) {//date tools
            let Y = startDate.getFullYear() + '-';
            let M = (startDate.getMonth() + 1 < 10 ? '0' + (startDate.getMonth() + 1) : startDate.getMonth() + 1) + '-';
            let D = startDate.getDate() < 10 ? '0' + (startDate.getDate()) : startDate.getDate();
            return Y + M + D;
        },

        getDate2(startDate) {//date tools
            let H = startDate.getHours() < 10 ? '0' + (startDate.getHours()) : startDate.getHours();
            let m = startDate.getMinutes() < 10 ? '0' + (startDate.getMinutes()) : startDate.getMinutes();
            let S = startDate.getSeconds() < 10 ? '0' + (startDate.getSeconds()) : startDate.getSeconds();
            return H + ":" + m + ":" + S;
        },

        //clean console
        cleanConsole() {
            //this.textarea = "";
            this.term.clear();
            this.total = 0;
        },

        //TODO start log getter
        startThread() {
            let that = this;
            this.excutestatus = !this.excutestatus;
            if (this.excutestatus) {
                this.excute = 'Stop';
                this.isFirst = true;

                //check
                let fq = this.formInline.fq;
                if (!(/(^[0-9]*[1-9][0-9]*$)/.test(fq))) {
                    return;
                }

                that.logThread = self.setInterval(function () {
                    that.dataAppend();
                }, that.formInline.fq * 1000);
            } else {
                this.excute = 'Start';
                window.clearInterval(that.logThread);
            }
        },

        getQueryList() {
            let queryList;
            if (this.formInline.enable) {
                queryList = this.tableData1;
            } else {
                queryList = [{
                    enable: true,
                    value: this.formInline.content,
                }]
            }
            return queryList;
        },

        dataAppend() {
            let queryList = this.getQueryList();

            if (this.isFirst) {
                this.logTimeStamp = new Date();
                this.isFirst = false;
            }
            let start = this.logTimeStamp.getTime();
            let now = new Date();
            let end = now.getTime();
            //this.logTimeStamp = now;
            this.getlog(start, end , true, queryList, 1000)
        },


        getlog(start, end, isAppend, queryList, limit) {
            let _self = this;
            this.$$api_cmdb_getlog({
                data: {
                    queryList: queryList,
                    level: _self.formInline.loglevle,
                    index: _self.formInline.index,
                    startTime: start,
                    endTime: end,
                    limit: limit,
                },
                fn: json => {
                    let list = json.data;
                    if (!isAppend) {
                        _self.textarea = "";
                        _self.term.clear();
                    }
                    if (!list || list.length == 0) {
                        return;
                    }
                    if (list.length >= limit) {
                        //this.$message.warning('log datas is too big , some logs will be lost , Please add filter');
                        /*this.$message({
                          message: '警告哦，这是一条警告消息',
                          type: 'warning'
                        });*/
                    }
                    this.total = this.total + list.length;
                    for (let i = 0; i < list.length; i++) {
                        //_self.textarea = _self.textarea + "\r\n" + list[i];
                        _self.term.writeln(list[i].message);
                        if(list[i]["@timestamp"]){
                          this.logTimeStamp = new Date(list[i]["@timestamp"]).getTime()
                        }
                    }
                }
            })
        },

        //stop
        stopThread() {
            if (this.excute == 'Stop') {
                this.excute = 'Start';
                this.excutestatus = false;
                window.clearInterval(this.logThread);
            }
        },

        // 加载最新
        tailLast() {
            this.stopThread();
            this.cleanConsole();
            let queryList = this.getQueryList();
            this.getlog(0, 0, false, queryList, 100);
            //auto start Thread
            //this.startThread();
        },

        // 增加一列表格
        addRow() {
            this.tableData1.push({enable: true, value: ''})
        }
    },

    //离开前清除定时任务
    beforeRouteLeave(to, from, next) {
        this.stopThread();
        next();
    }

}
