import {transDate, getDay} from 'utils/'

export default {
    name: 'online',
    data() {
        return {
            //查询条件
            searchParams: {
                id: '',
                principal: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            iamServers: [],

            saveForm: {
                alarmTemplate: {},

            },
            loading: false,

            rules: {
                id: [{ required: true, message: 'Private IAM Service ID is required', trigger: 'blur' }],
            },
            dom:null,
            cursor:'0@0',
            hasNext:false,
            loadDiv:{},
            loadSign:false
        }
    },

    mounted() {
        this.dom = this.$refs.table.bodyWrapper
        this.getIamServer();
        //this.getData();
    },
    watch: {
        tableData: {
            handler (val) {
                if (val.length) {
                    // this.$nextTick(() => {
                        let el = this.$refs.table.$el
                        const bodyWrap = el.querySelector('.el-table__body-wrapper')
                        // 我这里第一列固定，固定容器也要生成节点来对齐滚动容器
                        const fixedBodyWrap = el.querySelector('.el-table__fixed-body-wrapper')
                        let loadDiv = document.createElement('div')
                        let emptyDiv = document.createElement('div')
                        loadDiv.className = 'load-text'
                        emptyDiv.innerHTML = '.'
                        loadDiv.style.textAlign = 'center'
                        loadDiv.style.display = 'none'
                        emptyDiv.style.visibility = 'hidden'
                        const loadTextDom = el.querySelectorAll('.load-text')
                        // 未添加节点时添加
                        if (!loadTextDom.length) {
                            loadDiv.innerHTML = this.hasNext ? '努力加载中' : '人家是有底线的'
                            bodyWrap.appendChild(loadDiv)
                            fixedBodyWrap.appendChild(emptyDiv)
                        }
                        // 已生成节点时处理
                        if (loadTextDom.length) {
                            loadDiv.innerHTML = this.hasNext ? '努力加载中' : '人家是有底线的'
                            bodyWrap.appendChild(loadDiv)
                            fixedBodyWrap.appendChild(emptyDiv)
                        }
                    // })
                }
            },
            deep: true
        }
    },
    methods: {
        onwatch(){
            this.dom = this.$refs.table.bodyWrapper
            this.dom.addEventListener('scroll', () => {
                // 滚动距离
                let scrollTop = this.dom.scrollTop
                // 变量windowHeight是可视区的高度
                let windowHeight = this.dom.clientHeight || this.dom.clientHeight
                // 变量scrollHeight是滚动条的总高度
                let scrollHeight = this.dom.scrollHeight || this.dom.scrollHeight
                let el = this.$refs.table.$el
                let loadDiv = el.querySelector('.load-text')
                if (scrollTop + windowHeight === scrollHeight) {
                    // 获取到的不是全部数据 当滚动到底部 继续获取新的数据
                    if(this.loadSign){
                        if (this.hasNext) {
                            this.loading = true;
                            loadDiv.style.display = 'block'
                            loadDiv.innerHTML = '努力加载中'
                            this.getData()
                        }else{
                            loadDiv.style.display = 'block'
                            loadDiv.innerHTML = '人家是有底线的'
                        }
                    }
                }
            })
        },
        lazyLoad () {
            let el = this.$refs.table.$el
            let loadDiv = el.querySelector('.load-text')
            if(this.loadSign){
                if (this.hasNext) {
                    this.loading = true;
                    loadDiv.style.display = 'block'
                    loadDiv.innerHTML = '努力加载中'
                    this.getData()
                }else{
                    loadDiv.style.display = 'block'
                    loadDiv.innerHTML = '人家是有底线的'
                }
            }
        },
        onSubmit() {
            this.cursor = '0@0'
            this.tableData = []
            if(this.dom){
                console.info('this.dom.scrollTop:',this.dom.scrollTop)
                this.dom.scrollTop = 0
            }
            this.getData();
            // this.onwatch()
        },

        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.loadSign = false
            this.$refs['searchForm'].validate((valid) => {
                if (valid) {
                    this.$$api_iam_onlineList({
                        data: {
                            id: this.searchParams.id,
                            principal: this.searchParams.principal,
                            limit:100,
                            cursor: this.cursor
                        },
                        fn: json => {
                            this.loading = false;
                            this.loadSign = true;
                            this.tableData = this.tableData.concat(json.data.sessions)
                            this.cursor = json.data.index.cursorString
                            this.hasNext = json.data.index.hasNext
                            if(json.data.index.hasNext){
                                this.dom.scrollTop = this.dom.scrollTop - 400
                            }
                        },
                        errFn: () => {
                            this.loading = false;
                        }
                    })
                }else{
                    this.loading = false;
                }
            });

        },

        getIamServer(){
            this.$$api_iam_getIamServer({
                data: {},
                fn: json => {
                    this.iamServers = json.data;
                }
            })
        },

        destroySessions(row) {
            this.loading = true;
            this.$$api_iam_destroySessions({
                data: {
                    id: this.searchParams.id,
                    sessionId: row.id,
                    //principal: row.principal,
                },
                fn: json => {
                    this.$message({
                        message: 'destroy seccess',
                        type: 'success'
                    });
                    this.getData();
                },
                errFn: () => {
                    this.loading = false;
                }
            })
        },


        convertType(row, column, cellValue, index) {
            if(cellValue){
                return "true";
            }else{
                return "false";
            }
        },

        subStr(str){
            if(str.length>10){
                str = str.substring(0,10)+"...";
            }
            return str;
        },




    }
}
