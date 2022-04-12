import { transDate, getDay } from 'utils/'
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import de from "element-ui/src/locale/lang/de";

export default {
    name: 'pipeHisDetail',
    data() {
        return {

            taskHisId: '',

            lastTaskHisId: '',

            detailForm: {
                clusterName: '',
                branch: '',
                pipelineHistoryInstances: [],
                result: '',
                annex: '',
            },

            title: 'detail',
            startPos: 0,
            logThread: 0,
            term: null,

            detailVisible: false,
            dialogLoading: false,
            detailStartPos: 0,
            detailLogThread: 0,
            detailTerm: null,

            refreshListThread: 0,

            ///////
            logReadRunning: false,

        }
    },

    mounted() {

    },

    activated() {
        this.taskHisId = this.$route.query.id;
        if(this.lastTaskHisId == this.taskHisId){
            this.startRefreshList();
            this.readLog(this.taskHisId);
        }else{
            this.detail(this.taskHisId);
            this.lastTaskHisId = this.taskHisId
        }


    },

    methods: {

        changeLogReadRunning() {
            this.logReadRunning = !this.logReadRunning;
            if (this.logReadRunning) {
                this.readLog(this.taskHisId);
            } else {
                this.stopReadLogTask();
            }
        },

        ///////////

        backToChanges() {
            this.$router.push({ path: this.permitutil.getRoutePathByPermission('uci:pipehis')})
        },

        convertStatusType(row) {
            if (row.status == 0) {
                return '#75a2f9';
            }
            if (row.status == 1) {
                return '#50bfff';
            }
            if (row.status == 2) {
                return '#44e88d';
            }
            if (row.status == 4) {
                return '#dc9417';
            }
            if (row.status == 5) {
                return '#f77171';
            }
            return '#DC143C';
        },

        convertStatusValue(row) {
            switch (row.status) {
                case 0:
                    return { img: 'static/images/state/gray_normal.png', text: 'New' };
                case 1:
                    return { img: 'static/images/state/red_run.gif', text: 'Running' };
                case 2:
                    return { img: 'static/images/state/green_ok.png', text: 'Success' };
                case 3:
                    return { img: 'static/images/state/red_fail.png', text: 'Failed' };
                case 4:
                    return { img: 'static/images/state/red_fail.png', text: 'Timeout' };
                case 5:
                    return { img: 'static/images/state/red_fail.png', text: 'Stopped' };
                default:
                    return '--';
            }
        },

        startRefreshList() {
            let that = this;
            if (this.checkExistRunningTask()) {
                this.refreshListThread = self.setTimeout(function () {
                    that.detailRefresh();
                }, 1 * 3000);
            }
        },

        checkExistRunningTask() {
            if (this.detailForm.pipelineHistoryInstances) {
                for (var i in this.detailForm.pipelineHistoryInstances) {
                    let taskHis = this.detailForm.pipelineHistoryInstances[i];
                    if (taskHis['status'] == 0 || taskHis['status'] == 1) {//status is create or running
                        return true;
                    }
                }
            }
            return false;
        },

        stopRefreshList() {
            //window.clearInterval(this.refreshListThread);
            window.clearTimeout(this.refreshListThread);
        },

        detailRefresh() {
            let that = this;
            this.$$api_uci_pipeHisDetail({
                data: {
                    pipeHisId: this.taskHisId,
                },
                fn: json => {
                    this.detailForm.pipelineHistoryInstances = json.data.pipelineHistoryInstances;
                    that.startRefreshList();
                }
            })
        },

        detail(id) {
            let that = this;
            this.$$api_uci_pipeHisDetail({
                data: {
                    pipeHisId: id,
                },
                fn: json => {
                    this.detailForm = json.data;
                    // 由于偶尔渲染此页面时，xterm的cavas画出的内容高度变矮了，需要延时？延时暂时显示正常
                    that.readLogTask(id);
                    /*self.setTimeout(function () {
                        that.readLogTask(id);
                    }, 1 * 1000);*/
                    that.startRefreshList();
                }
            })
        },
        // ---------------------- Pipeline runner logs ------------------------
        readLogTask(id) {
            this.destoryReadLogTask();

            if (this.term) {
                this.term.dispose();
            }
            this.term = new Terminal({
                logLevel: 'off',
                allowTransparency: false,
                fontSize: 12,
                //rendererType: 'dom',
                // 最后结尾不能是','逗号??? 否则字体变得很小
                fontFamily: 'Consolas,DejaVu Sans Mono,WenQuanYi Zen Hei Mono,courier,monospace',
                letterSpacing: 0,// 文字间隔（px）
                theme: { background: '#121319', foreground: '#dfd2cd' }
            });
            const fitAddon = new FitAddon();

            this.term.loadAddon(fitAddon);
            this.term.open(document.getElementById('myterminal'));
            fitAddon.fit();

            this.detailForm.result = '';
            this.startPos = 0;
            this.readLog(id);
        },
        destoryReadLogTask() {
            console.debug("stop read log task");
            window.clearTimeout(this.logThread);
        },
        stopReadLogTask() {
            window.clearTimeout(this.logThread);
        },
        readLog(taskHisId) {
            console.debug("read log taskHisId=" + taskHisId + " pipeHisReadLog=" + this.startPos);
            let that = this;
            this.$$api_uci_pipeHisReadLog({
                data: {
                    pipeHisId: taskHisId,
                    startPos: that.startPos + 1,
                    size: 10000,
                },
                fn: json => {
                    let logs = json.data.data.lines;
                    this.logReadRunning = true;
                    for (let i in logs) {
                        /**
                         * console.log('\x1B[31m%s\x1B[0m', '错误');
                         * console.log('\x1B[32m%s\x1B[0m', '成功');
                         * console.log('\x1B[33m%s\x1b[0m:', '警告');
                         **/
                        // that.term.writeln(logs[i]);
                        var logLine = logs[i];
                        logLine = logLine.replace('INFO', '\x1B[32mINFO\x1B[0m');
                        logLine = logLine.replace('WARNING', '\x1B[33mWARNING\x1B[0m');
                        logLine = logLine.replace('ERROR', '\x1B[31mERROR\x1B[0m');
                        that.term.writeln(logLine);
                    }
                    that.startPos = json.data.data.endPos;
                    if (!json.data.data.hasNext) {
                        window.clearTimeout(that.logThread);
                        this.logReadRunning = false;
                        return;
                    }

                    //console.debug(that.startPos);
                    this.logThread = self.setTimeout(function () {
                        that.readLog(taskHisId);
                    }, 1 * 1000);
                },
                errFn: () => {
                    //do nothing
                }
            })
        },
        // --------------------- Pipeline deploying logs ------------------------
        openDetail(row) {
            this.detailVisible = true;
            this.title = '部署到[' + row.instanceName + ']详情';
            this.dialogLoading = true;
            //在旧版1.x中，对dialog没有opened回调事件，需要手动延时
            setTimeout(() => {
                this.readLogDetailTask(row.instanceId);
            }, 300)
        },
        // log part
        readLogDetailTask(instanceId) {
            //this.destoryReadLogDetailTask();
            if (this.detailTerm) {
                this.detailTerm.dispose();
            }
            console.debug('before new Terminal timestamp: ' + new Date().getTime());
            this.detailTerm = new Terminal({
                logLevel: 'off',
                allowTransparency: true,
                fontSize: 12,
                // 最后结尾不能是','逗号??? 否则字体变得很小
                fontFamily: 'Consolas,DejaVu Sans Mono,WenQuanYi Zen Hei Mono,courier,monospace',
                letterSpacing: 0,// 文字间隔（px）
                theme: { background: '#121319', foreground: '#dfd2cd' }
            });
            const fitAddon = new FitAddon();
            this.detailTerm.loadAddon(fitAddon);
            let detailTerminal = document.getElementById('detailTerminal');
            this.detailTerm.open(detailTerminal);
            fitAddon.fit();
            console.debug('before new Terminal timestamp = ' + new Date().getTime());
            this.dialogLoading = false;
            // Reset log start position
            this.detailStartPos = 0;
            this.readDetailLog(instanceId);
        },

        destoryReadLogDetailTask() {
            window.clearTimeout(this.detailLogThread);
            if (this.detailTerm) {
                this.detailTerm.dispose();
            }
        },

        readDetailLog(instanceId) {
            var that = this;
            this.$$api_uci_pipeHisReadDetailLog({
                data: {
                    pipeHisId: this.taskHisId,
                    instanceId: instanceId,
                    startPos: that.detailStartPos,
                    size: 10000,
                },
                fn: json => {
                    let logs = json.data.data.lines;
                    for (let i in logs) {
                        /**
                         * console.log('\x1B[31m%s\x1B[0m', '错误');
                         * console.log('\x1B[32m%s\x1B[0m', '成功');
                         * console.log('\x1B[33m%s\x1b[0m:', '警告');
                         **/
                        this.detailTerm.writeln(logs[i]);
                    }
                    if (!json.data.data.hasNext) {
                        window.clearTimeout(this.detailLogThread);
                        return;
                    }
                    that.detailStartPos = json.data.data.endPos;
                    //console.debug(that.startPos);
                    this.detailLogThread = self.setTimeout(function () {
                        that.readDetailLog(instanceId);
                    }, 1 * 1000);
                },
                errFn: () => {
                    //do nothing
                }
            })
        },

        reload(){
            if (this.term) {
                this.term.clear()
            }
            this.startPos = 0;
            this.readLog(this.taskHisId);
        }
    },

    //离开前清除定时任务
    beforeRouteLeave(to, from, next) {
        this.detailVisible = false;
        this.destoryReadLogTask();
        this.stopRefreshList();
        next();
    },

}
