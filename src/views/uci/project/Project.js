import {transDate, getDay} from 'utils/'
import fa from "element-ui/src/locale/lang/fa";

export default {
    name: 'project',
    data() {


        return {

            //查询条件
            searchParams: {
                groupName: '',
                projectName: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //弹窗表单
            saveForm: {
                id: '',
                appClusterId: '',
                projectName: '',
                httpUrl: '',
                sshUrl: '',
                gitInfo: '',

                remark: '',
                restartCommand: '',
                dependencies: [],
                vcsId: '',
                clusterName: '',

                isBoot: 1,
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            searchProjectLoading: false,

            //create内的下拉数据
            groupData: [],

            //create内的下拉数据
            ProjectData: [],

            //vcs数据
            vcsData: [],

            //列表Data
            tableData: [],

            vcsProjectData: [],

            //详情
            detailVisible: false,
            detailForm: {
                group: '',
                branch: '',
                taskInstances: [],
                result: ''
            },

            // 表单规则
            rules: {
                projectName: [
                    {required: true, message: 'Please Input projectName', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],

            },
            loading: false,

            appClusterId: '',
        }
    },

    activated() {
        if(this.$route.query.appClusterId){
            this.appClusterId = Number(this.$route.query.appClusterId);
            this.addPriject();
            this.saveForm.appClusterId = this.appClusterId;
        }else{
            this.appClusterId = '';
        }

    },

    mounted() {
        this.getData();
        this.getGroup();
        this.getVcs();
        this.getProject();

    },

    methods: {

        onSubmit() {
            this.getData();
        },

        //add
        addPriject() {
            this.getGroup();
            this.getProject();

            this.cleanSaveForm();
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'New Project information';
        },


        // 获取分组名称
        getVcs() {
            this.$$api_urm_vcsAll({
                fn: json => {
                    this.vcsData = json.data;
                    if(this.vcsData && this.vcsData[0] && !this.saveForm.vcsId){
                        this.saveForm.vcsId = this.vcsData[0]['id'];
                    }
                },
            })
        },

        // 获取分组名称
        getProject() {
            this.$$api_uci_getProjectBySelect({
                fn: json => {
                    this.ProjectData = json.data.list;
                },
            })
        },

        deleteDep(index) {
            this.saveForm.dependencies.splice(index, 1);
        },

        addRow() {
            this.saveForm.dependencies.push({
                dependentId: '',
                branch: '',
            })
        },

        //edit
        editPriject(row) {
            this.getGroup();
            this.getProject();

            if (!row.id) {
                return;
            }
            this.$$api_uci_projectDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    //this.loading = false;
                    this.saveForm = json.data.project;
                    this.remoteMethod(this.saveForm.projectName);
                },
            });
            this.dialogLoading = false;
            this.dialogVisible = true;
            this.dialogTitle = 'Configuer Project information';
        },

        currentChange(i) {
            //this.loading = true;
            this.pageNum = i;
            this.getData();
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_uci_projectList({
                data: {
                    groupName: this.searchParams.groupName,
                    projectName: this.searchParams.projectName,
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

        // 获取分组名称
        getGroup() {
            this.$$api_cmdb_clusters({
                fn: json => {
                    this.groupData = json.data.clusters;
                    //this.saveForm.appClusterId = this.appClusterId;
                },
            })
        },

        saveProject() {
            this.dialogLoading = true;

            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_uci_saveProject({
                        data: {
                            id: this.saveForm.id,
                            appClusterId: this.saveForm.appClusterId,
                            projectName: this.saveForm.projectName,
                            httpUrl: this.saveForm.httpUrl,
                            sshUrl: this.saveForm.sshUrl,
                            gitInfo: this.saveForm.gitInfo,
                            vcsId: this.saveForm.vcsId,
                            restartCommand: this.saveForm.restartCommand,
                            remark: this.saveForm.remark,
                            dependencies: this.saveForm.dependencies,
                            isBoot: this.saveForm.isBoot,
                            organizationCode: this.saveForm.organizationCode,
                        },
                        fn: json => {
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.getData();
                            this.cleanSaveForm();
                            this.backToPipeline();
                        },
                        errFn: () => {
                            this.dialogLoading = false;
                        }
                    });
                } else {
                    this.dialogLoading = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        cleanSaveForm() {
            let firstVscId = '';
            if(this.vcsData && this.vcsData[0]){
                firstVscId = this.vcsData[0]['id'];
            }

            this.saveForm = {
                id: '',
                appClusterId: '',
                projectName: '',
                httpUrl: '',
                sshUrl: '',
                gitInfo: '',
                remark: '',
                restartCommand: '',
                dependencies: [],
                vcsId: firstVscId,
                clusterName: '',
                isBoot: 1,
            }
        },

        delProject(row) {
            if (!row.id) {
                return;
            }

            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_uci_delProject({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.getData();
                    },
                })
            }).catch(() => {
                //do nothing
            });
        },

        convertLockStatus(row) {
            if (row.lockStatus == 1) {
                return '解锁';
            } else {
                return '非锁定';
            }
        },

        convertLockStatusDisable(row) {
            if (row.lockStatus == 1) {
                return false;
            } else {
                return true;
            }
        },

        unlock(row) {
            if (!row.id) {
                return;
            }
            this.$confirm('Confirm?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_uci_unlock({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.getData();
                    },
                })
            }).catch(() => {
                /*this.$message({
                    type: 'info',
                    message: '已取消删除'
                });*/
            });
        },

        changeVcs(){
            if(!this.saveForm.vcsId){
                return;
            }
            this.remoteMethod();
        },


        remoteMethod(query) {
            this.searchProjectLoading = true;
            this.$$api_urm_vcsProjects({
                data: {
                    vcsId: this.saveForm.vcsId,
                    projectName: query,
                },
                fn: json => {
                    this.vcsProjectData = json.data;
                    this.searchProjectLoading = false;
                    this.changeProject();
                },
            })
        },

        changeProject(){
            if(!this.saveForm.projectName){
                return;
            }
            let remoteProject = this.getProjectByName(this.saveForm.projectName);
            if(remoteProject){
                this.saveForm.httpUrl = remoteProject.httpUrl;
                this.saveForm.sshUrl = remoteProject.sshUrl;
                this.saveForm.gitInfo = JSON.stringify(remoteProject);
            }
        },


        getProjectByName(name){
            for(let i = 0;i<this.vcsProjectData.length;i++){
                if(this.vcsProjectData[i].name==name){
                    return this.vcsProjectData[i];
                }
            }
        },

        backToPipeline(){
            if(this.appClusterId){
                this.$router.push({path: this.permitutil.getRoutePathByPermission('uci:pipeline:edit') ,query: {from: 'project'}})
            }
            this.appClusterId = '';
        }

    }
}
