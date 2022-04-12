import { transDate, getDay } from 'utils/'

export default {
    name: 'pipelineEdit',
    data() {
        var validateInstances = (rule, value, callback) => {
            if (value.length <= 0) {
                callback(new Error('Instances is Empty'));
            } else {
                callback();
            }
        };
        return {
            //弹窗表单
            saveForm: {
                providerKind: '',
                id: '',
                pipeName: '',
                clusterId: '',
                environment: '',

                projectName: '',
                assetsDir: '',
                assetsPath3: '{clusterName}-{version}-bin.tar',
                parentAppHome: '',

                pipeStepBuilding: {
                    pipeStepBuildingProjects: [],
                    preCommand: '',
                    postCommand: '',
                    refType: 1,
                },

                commandOnOff: false,
                pipeStepInstanceCommand: {
                    preCommand: '',
                    postCommand: '',
                },

                testOnOff: false,
                analysisOnOff: false,

                dockerOnOff: false,

                instanceOnOff: 1,
                instanceIds: [],

                pipeStepPcm: {
                    enable: 0,
                    pipeId: '',
                    pcmId: '',
                    xProjectId: '',
                    xTracker: '',
                    xStatus: '',
                    xPriority: '',
                },

                pipeStepApi:{
                    enable: 0,
                    repositoryId: '',
                    versionId: '',
                    moduleId: '',
                },

                contactOnOff: false,
                pipeStepNotification: {
                    enable: 0,
                    contactGroupId: [],
                },
            },
            isEdit: false,

            pcmStatuses: [],
            pcmTrackers: [],
            pcmPriorities: [],

            //create内的下拉数据
            envirData: [],
            instanceData: [],
            instanceData2: [],
            branchs: [],
            contactGroupData: [],
            pcmData: [],
            //projectData:[],
            clusterData: [],

            pcmProjects: [],

            postCommandTip: '<br/>. /etc/profile && . /etc/bashrc && . ~/.bash_profile && . ~/.bashrc && ',

            gotoProjectSettingDialog: false,

            // 表单规则
            rules: {
                pipeName: [
                    { required: true, message: 'Please Input pipeName', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                clusterId: [
                    { required: true, message: 'Please select Cluster', trigger: 'change' },
                ],
                providerKind: [
                    { type: 'number', required: true, message: 'Please select tar type', trigger: 'change' },
                ],
                instanceIds: [
                    { validator: validateInstances, required: true, trigger: 'change' },
                ],

            },
            loading: false,

            activeStep: 0,


            apiRepositorys: [],
            apiVersions: [],
            apiModules: [],
        }
    },

    activated() {
        const from = this.$route.query.from;
        if (!from || from === 'task') {
            this.cleanSaveForm();
            this.saveForm.id = this.$route.query.id;
            let command = this.$route.query.command;
            if (command) {
                this.saveForm.providerKind = command;
            }
            this.getClusters();
            this.groupList();
            this.getPcm();
            this.getApiRepositorys();

            if (this.saveForm.id) {
                this.isEdit = true;
                this.pipelineDetail(this.taskId);
            } else {
                this.isEdit = false;
            }
        } else {
            this.gotoProjectSettingDialog = false;
            this.onChangeCluster(this.saveForm.clusterId);
        }
    },

    mounted() {

    },

    methods: {
        cleanSaveForm() {
            this.instanceData2 = [];

            this.saveForm = {
                providerKind: '',
                id: '',
                pipeName: '',
                clusterId: '',
                environment: '',

                projectName: '',
                assetsDir: '',
                assetsPath3: '{clusterName}-{version}-bin.tar',
                parentAppHome: '',

                pipeStepBuilding: {
                    pipeStepBuildingProjects: [],
                    preCommand: '',
                    postCommand: '',
                    refType: 1,
                },

                commandOnOff: false,
                pipeStepInstanceCommand: {
                    preCommand: '',
                    postCommand: '',
                },

                testOnOff: false,
                analysisOnOff: false,

                dockerOnOff: false,

                instanceOnOff: 1,
                instanceIds: [],

                pipeStepPcm: {
                    enable: 0,
                    pipeId: '',
                    pcmId: '',
                    xProjectId: '',
                    xTracker: '',
                    xStatus: '',
                    xPriority: '',
                },

                pipeStepApi:{
                    enable: 0,
                    repositoryId: '',
                    versionId: '',
                    moduleId: '',
                },

                contactOnOff: false,
                pipeStepNotification: {
                    enable: 0,
                    contactGroupId: [],
                },

            }
        },

        refreshClusterData() {
            //this.getProject();
            this.getClusters();
        },
        refreshPcmtData() {
            this.getPcm();
        },
        refreshInstanceData() {
            this.getinstance();
        },


        groupList() {
            this.$$api_iam_groupList({
                data: {

                },
                fn: json => {
                    this.contactGroupData = json.data;
                },
            })
        },

        // 获取分组名称
        getClusters() {
            this.$$api_cmdb_clusters({
                fn: json => {
                    this.clusterData = json.data.clusters;
                },
            })
        },

        //获取实例名称
        getinstance() {
            let clusterId = this.saveForm.clusterId;
            let environment = this.saveForm.environment;
            this.instanceData = [];
            if (!environment || environment == "" || !clusterId || clusterId == "") {
                return;
            }
            this.$$api_cmdb_instances({
                data: {
                    clusterId: clusterId,
                    envType: environment
                },
                fn: json => {
                    this.instanceData = json.data.instances;
                    this.instanceData2 = [];
                    for (let i = 0; i < this.instanceData.length; i++) {
                        this.instanceData2.push({
                            label: this.instanceData[i].name,
                            key: this.instanceData[i].id,
                        });
                    }


                    //判断要不要清空选中
                    let needClean = true;
                    for (let i = 0; i < this.instanceData.length; i++) {
                        if (this.instanceData[i].id == this.saveForm.instanceIds[0]) {
                            needClean = false;
                            break;
                        }
                    }
                    if (needClean) {
                        this.saveForm.instanceIds = [];
                    }
                },
            })
        },

        //获取环境名称
        onChangeCluster(id) {
            this.getPipeStepBuilding();
            this.getinstance();
            this.saveForm.assetsPath3 = '/' + this.getClusterNameById(id) + '-{version}-bin.tar';
            this.getProjectByAppClusterId();
        },

        getClusterNameById(id) {
            for (let i in this.clusterData) {
                if (this.clusterData[i].id === id) {
                    return this.clusterData[i].name;
                }
            }
            return '';
        },


        save() {
            this.loading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_uci_savePipeline({
                        data: this.saveForm,
                        fn: json => {
                            this.loading = false;
                            this.cleanSaveForm();
                            this.$router.push({ path: this.permitutil.getRoutePathByPermission('uci:pipeline') })
                        },
                        errFn: (err) => {
                            this.loading = false;
                            this.$message.error(err.message);
                        }
                    })
                } else {
                    this.loading = false;
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        fixData(data) {
            if (!data.pipeStepBuilding) {
                data.pipeStepBuilding = {
                    pipeStepBuildingProjects: [],
                    preCommand: '',
                    postCommand: '',
                    refType: 1,
                }
            }

            if (!data.pipeStepInstanceCommand) {
                data.pipeStepInstanceCommand = {
                    preCommand: '',
                    postCommand: '',
                }
            }

            if (!data.instanceIds) {
                data.instanceIds = [];
            }

            if (!data.pipeStepPcm) {
                data.pipeStepPcm = {
                    enable: 0,
                    pipeId: '',
                    pcmId: '',
                    xProjectId: '',
                    xTracker: '',
                    xStatus: '',
                    xPriority: '',
                }
            }

            if (!data.pipeStepNotification) {
                data.pipeStepNotification = {
                    enable: 0,
                    contactGroupId: [],
                }
            }
        },

        pipelineDetail() {
            this.isEdit = true;
            this.$$api_uci_pipelineDetail({
                data: {
                    id: this.saveForm.id,
                },
                fn: json => {
                    //fix
                    if (json.data.instanceIds && json.data.instanceIds.length > 0) {
                        json.data.instanceOnOff = 1;
                    } else {
                        json.data.instanceOnOff = 0;
                    }
                    this.fixData(json.data);
                    this.saveForm = json.data;

                    if (!json.data.pipeStepInstanceCommand) {
                        this.saveForm.pipeStepInstanceCommand = {
                            enable: false,
                            preCommand: '',
                            postCommand: '',
                        };
                    }

                    if (!json.data.pipeStepApi) {
                        this.saveForm.pipeStepApi = {
                            enable: 0,
                            repositoryId: '',
                            versionId: '',
                            moduleId: '',
                        };
                    }
                    if(this.saveForm.pipeStepApi.repositoryId){
                        this.getApiModules(this.saveForm.pipeStepApi.repositoryId);
                    }
                    if(this.saveForm.pipeStepApi.versionId){
                        this.getApiVersions(this.saveForm.pipeStepApi.versionId);
                    }



                    this.getProjectByAppClusterId();
                    this.getinstance();
                    this.getPipeStepBuilding();
                    this.onChangePcm();

                    this.saveForm.assetsPath3 = '/' + this.getClusterNameById(this.saveForm.clusterId) + '-{version}-bin.tar';
                },
            })

        },



        getProjectByAppClusterId() {
            if (this.saveForm.clusterId == '') {
                return;
            }
            this.$$api_uci_getProjectByAppClusterId({
                data: {
                    clusterId: this.saveForm.clusterId,
                },
                fn: json => {
                    this.saveForm.projectName = json.data.projectName;
                },
            })
        },

        getPipeStepBuilding() {
            if (!this.saveForm.clusterId) {
                return
            }
            this.$$api_uci_getPipeStepBuilding({
                data: {
                    pipeId: this.saveForm.id,
                    clusterId: this.saveForm.clusterId,
                    refType: this.saveForm.pipeStepBuilding.refType,
                },
                fn: json => {
                    this.saveForm.pipeStepBuilding = json.data;
                },
            })
        },

        backToTask() {
            this.$router.push({ path: this.permitutil.getRoutePathByPermission('uci:pipeline') })
        },

        getPcm() {
            this.$$api_uci_pcmAll({
                fn: json => {
                    this.pcmData = json.data;
                },
            })
        },

        gotoProjectSetting() {
            this.$router.push({ path: this.permitutil.getRoutePathByPermission('uci:project'), query: { appClusterId: this.saveForm.appClusterId } })
            this.gotoProjectSettingDialog = false;
        },


        //pcm
        onChangePcm() {
            if (!this.saveForm.pipeStepPcm.pcmId) {
                return;
            }
            this.getPcmStatuses();
            this.getPcmTrackers();
            this.getPcmPriorities();
            this.getProjectsByPcmId();
        },
        getProjectsByPcmId() {
            this.$$api_uci_getProjectsByPcmId({
                data: {
                    pcmId: this.saveForm.pipeStepPcm.pcmId,
                },
                fn: json => {
                    this.pcmProjects = json.data;
                },
            })
        },
        getPcmStatuses() {
            this.$$api_uci_getPcmStatuses({
                data: {
                    pcmId: this.saveForm.pipeStepPcm.pcmId,
                },
                fn: json => {
                    this.pcmStatuses = json.data;
                },
            })
        },
        getPcmTrackers() {
            this.$$api_uci_getPcmTrackers({
                data: {
                    pcmId: this.saveForm.pipeStepPcm.pcmId,
                },
                fn: json => {
                    this.pcmTrackers = json.data;
                },
            })
        },
        getPcmPriorities() {
            this.$$api_uci_getPcmPriorities({
                data: {
                    pcmId: this.saveForm.pipeStepPcm.pcmId,
                },
                fn: json => {
                    this.pcmPriorities = json.data;
                },
            })
        },

        clickStep(id) {
            //this.$message.success(''+id);
            // Way1
            const anchor = this.$el.querySelector("#pipe_step" + id);
            document.documentElement.scrollTop = anchor.offsetTop - 80;
            this.activeStep = id - 1;
            // Way2
            //document.querySelector("#testjump").scrollIntoView(true);
        },


        getApiRepositorys(){
            this.$$api_udm_enterpriseProjectList({
                data: {
                    pageNum: 1,
                    pageSize: 100,
                },
                fn: json => {
                    this.apiRepositorys = json.data.records;
                },
            })
        },

        getApiVersions(repositoryId){
            this.$$api_udm_enterpriseProjectVersionList({
                data: {
                    pageNum: 1,
                    pageSize: 100,
                    repositoryId: repositoryId
                },
                fn: json => {
                    this.apiVersions = json.data.records;
                },
            })
        },

        getApiModules(versionId){
            this.$$api_udm_enterpriseApiModuleList({
                data: {
                    pageNum: 1,
                    pageSize: 100,
                    versionId: versionId,
                },
                fn: json => {
                    this.apiModules = json.data.records;
                },
            })
        },

        changeRepository(){
            if(this.saveForm.pipeStepApi.repositoryId){
                this.getApiVersions(this.saveForm.pipeStepApi.repositoryId);
            }
        },

        changeVersion(){
            if(this.saveForm.pipeStepApi.versionId){
                this.getApiModules(this.saveForm.pipeStepApi.versionId);
            }
        }

    }
}
