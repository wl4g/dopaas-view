import {transDate, getDay} from 'utils/'
import dateutils from "../../../common/dateutils";

export default {
    name: 'vcsProject',
    data() {
        return {
            //查询条件
            searchParams: {
                vscId: '',
                groupIds: [],
                groupId: '',
                groupName: '',
                projectName: '',
            },

            vcsGroups: [],
            props:{
                value: 'id',
                label: 'name',
                children: 'children',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            tableData: [],

        }
    },

    mounted() {

    },

    activated() {
        this.searchParams.vscId = this.$route.query.id;
        this.getGroups();
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
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Add VCS information';
        },

        // 获取列表数据
        getData() {
            this.$$api_urm_getProjects({
                data: {
                    vcsId: this.searchParams.vscId,
                    groupId: this.searchParams.groupId,
                    projectName: this.searchParams.projectName,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    this.total = json.data.total;
                    this.tableData = json.data.records;
                },
                errFn: () => {
                    this.loading = false;
                }
            })
        },

        getGroups() {
            this.$$api_urm_getGroups({
                data: {
                    id: this.searchParams.vscId,
                    groupName: this.searchParams.groupName,
                },
                fn: json => {
                    this.vcsGroups = json.data;
                },
            })
        },

        dateformat(row, column, cellValue, index){
            var moment = require('moment');
            var date = row[column.property];
            if (!date || date === 0) {
                return "";
            }
            return moment(date).format("YYYY-MM-DD HH:mm:ss")
        },

        back(){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('urm:repository')})
        },

        toProjectDetail(row){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('urm:project:detail'),query: {vcsId:this.searchParams.vscId,projectId:row.id}})
        },

        onChangeGroup(){
            if(this.searchParams.groupIds && this.searchParams.groupIds.length > 0){
                this.searchParams.groupId = this.searchParams.groupIds[this.searchParams.groupIds.length-1];
            }
        },





    }
}
