import {getDay, transDate} from 'utils/'
import dateutils from "../../../common/dateutils";

export default {
    name: 'projectDetail',
    data() {
        return {
            //查询条件
            searchParams: {
                vcsId: '',
                projectId: '',
            },

            activeCard: 'first',

            projectDetail: {},
            branchs: [],
            tags: [],

            newBranchDialog: false,
            newTagDialog: false,

            newBranchForm: {
                vcsId: '',
                projectId: '',
                ref: '',
                branch: '',
            },

            newTagForm: {
                vcsId: '',
                projectId: '',
                ref: '',
                tag: '',
                message: '',
            },

            clonevVisible: false,


        }
    },

    mounted() {

    },

    activated() {
        this.searchParams.vcsId = this.$route.query.vcsId;
        this.searchParams.projectId = this.$route.query.projectId;
        this.getData();
    },

    methods: {

        onSubmit() {
            this.getData();
        },

        getData(){
            this.getProjectById();
            this.getBranchs();
            this.getTags();
        },

        // project detail
        getProjectById() {
            this.$$api_urm_getProjectById({
                data: {
                    vcsId: this.searchParams.vcsId,
                    projectId: this.searchParams.projectId,
                },
                fn: json => {
                    this.projectDetail = json.data;
                },
            })
        },

        getBranchs() {
            this.$$api_urm_getBranchs({
                data: {
                    vcsId: this.searchParams.vcsId,
                    projectId: this.searchParams.projectId,
                },
                fn: json => {
                    this.branchs = json.data;
                },
            })
        },

        getTags() {
            this.$$api_urm_getTags({
                data: {
                    vcsId: this.searchParams.vcsId,
                    projectId: this.searchParams.projectId,
                },
                fn: json => {
                    this.tags = json.data;
                },
            })
        },

        back(){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('urm:project'),query: {id:this.searchParams.vcsId}})
        },

        handleCommand(command){
            if(command === 'a'){
                this.newBranchForm = {
                    vcsId: this.searchParams.vcsId,
                    projectId: this.searchParams.projectId,
                    ref: '',
                    branch: '',
                };
                this.newBranchDialog = true;
            }else if (command === 'b'){
                this.newTagForm = {
                    vcsId: this.searchParams.vcsId,
                    projectId: this.searchParams.projectId,
                    ref: '',
                    tag: '',
                    message: '',
                };
                this.newTagDialog = true;
            }
        },

        createBranch() {
            this.$$api_urm_createBranch({
                data: this.newBranchForm,
                fn: json => {
                    this.getBranchs();
                    this.newBranchDialog = false;
                    this.$message.success('添加成功！')
                },
            })
        },

        createTag() {
            this.$$api_urm_createTag({
                data: this.newTagForm,
                fn: json => {
                    this.getTags();
                    this.newTagDialog = false;
                    this.$message.success('添加成功！')
                },
            })
        },

        dateformat(date){
            var moment = require('moment');
            return moment(date).format("YYYY-MM-DD HH:mm:ss")
        },

        dateformat2(row, column, cellValue){
            return dateutils.dateFormat("YYYY-mm-dd HH:MM:SS", cellValue);
        },

        onCopySuccess(){
            this.$message.success('复制成功');
        },







    }
}
