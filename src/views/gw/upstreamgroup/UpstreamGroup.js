import {transDate, getDay} from 'utils/'
import upstream from "../upstream";

export default {
    name: 'host',
    components: {
        'upstream': upstream,
    },
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

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                gwUpstreamGroupRefs: [],
            },

            upstreams: [],

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            hosts: [],

            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'blur' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
            },
            loading: false,
            activeName: 'first',
        }
    },

    mounted() {
        this.getData();
        this.getUpstreams();
    },

    methods: {

        onSubmit() {
            this.getData();
        },

        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },

        addData() {
            this.cleanSaveForm();
            this.dialogVisible = true;
            this.dialogTitle = 'Add Docker Cluster';
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_gw_upstreamGroupList({
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

        cleanSaveForm() {
            this.saveForm = {
                id: '',
                name: '',
                gwUpstreamGroupRefs: [],
            };
        },

        saveData() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_gw_saveUpstreamGroup({
                        data: this.saveForm,
                        fn: json => {
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.getData();
                            this.cleanSaveForm();
                        },
                        errFn: () => {
                            this.dialogLoading = false;
                        }
                    });
                }else {
                    this.dialogLoading = false;
                }
            });
        },

        editData(row) {
            if (!row.id) {
                return;
            }
            this.cleanSaveForm();
            this.$$api_gw_upstreamGroupDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    if(!json.data.gwUpstreamGroupRefs){
                        json.data.gwUpstreamGroupRefs = [];
                    }
                    this.saveForm = json.data;

                    this.fixUpstreamsShow();
                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Edit Docker Cluster';
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
                this.$$api_gw_delUpstreamGroup({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.$message({
                            message: 'Success',
                            type: 'success'
                        });
                        this.getData();
                    },
                })
            }).catch(() => {
                //do nothing
            });
        },

        // 获取列表数据
        getUpstreams() {
            this.$$api_gw_getUpstreamsForSelect({
                data: {},
                fn: json => {
                    this.upstreams = json.data;
                    this.fixUpstreamsShow();
                }
            })
        },


        fixUpstreamsShow(){
            for(let i in this.saveForm.gwUpstreamGroupRefs){
                this.buildUpstreamsShow(this.saveForm.gwUpstreamGroupRefs[i]);
            }
        },

        buildUpstreamsShow(hadUpstream){
            hadUpstream.showUpstream = [];
            for(let i in this.upstreams){
                if(this.isContainUpstream(this.upstreams[i].id)){
                    if(this.upstreams[i].id==hadUpstream.upstreamId){
                        hadUpstream.showUpstream.push(this.upstreams[i]);
                    }
                }else{
                    hadUpstream.showUpstream.push(this.upstreams[i]);
                }
            }
        },

        isContainUpstream(upstreamId){
            for(let i in this.saveForm.gwUpstreamGroupRefs){
                if(this.saveForm.gwUpstreamGroupRefs[i].upstreamId==upstreamId){
                    return true;
                }
            }
            return false;
        },

        deleteRow(index) {
            this.saveForm.gwUpstreamGroupRefs.splice(index, 1);
            this.fixUpstreamsShow()
        },

        addRow() {
            if (!this.saveForm.gwUpstreamGroupRefs) {
                this.saveForm.gwUpstreamGroupRefs = [];
            }
            this.saveForm.gwUpstreamGroupRefs.push({
                upstreamId: '',
                weight: '50',
            })
            this.fixUpstreamsShow()
        },



    }
}
