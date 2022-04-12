import {transDate, getDay} from 'utils/'

export default {
    name: 'newPipeline',
    data() {
        return {

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                remark: '',
                endpoint: '',
                deployType: '',
                sshId: '',

                environments:[
                    {envType: 'dev',runCommand: '', enable:0, configContent:'',repositoryId: '',repositoryNamespace: '',dockerRepository:{authConfigModel:{}}},
                    {envType: 'fat',runCommand: '', enable:0, configContent:'',repositoryId: '',repositoryNamespace: '',dockerRepository:{authConfigModel:{}}},
                    {envType: 'uat',runCommand: '', enable:0, configContent:'',repositoryId: '',repositoryNamespace: '',dockerRepository:{authConfigModel:{}}},
                    {envType: 'pro',runCommand: '', enable:0, configContent:'',repositoryId: '',repositoryNamespace: '',dockerRepository:{authConfigModel:{}}},
                ],

                // registryAddress: '',
                // authConfigModel:{
                //     username: '',
                //     password: '',
                // },

                //instances: [],
                //instanceDtoModels:[],
            },

            isEdit: false,
            //allHost
            allHost: [],
            sshs: [],
            dockerRepositorys: [],
            repositoryProjects: [],

            searchRepositoryProjectsLoading: false,

            textDialogVisible: false,
            tempRow: null,
            tempText: '',
            tempTip: '',
            isPub: false,

            rules: {
                name: [{ required: true, message: 'Please input name', trigger: 'blur' }],

                envType: [
                    {required: true, message: 'Please select Env', trigger: 'change' },
                ],
                sshId: [
                    {required: true, message: 'Please select host', trigger: 'change' },
                ],
                endpoint: [
                    {required: true, message: 'Please input endpoint', trigger: 'change' },
                ],
            },
            loading: false,

            tipDialogVisible: false,

        }
    },

    activated() {
        this.getAllHost();
        this.getSshs();
        this.cleanSaveForm();
        this.getDockerRepositorys();

        const id = this.$route.query.id;
        if(id){// edit
            this.isEdit = true;
            this.saveForm.id = id;
            this.dataDetail(id);
        }else{// insert
            this.isEdit = false;
        }

    },

    mounted() {

    },

    methods: {

        back(){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('cmdb:cluster')})
        },
        cleanSaveForm() {
            this.saveForm={
                id: '',
                name: '',
                remark: '',
                endpoint: '',
                deployType: '',
                sshId: '',

                environments:[
                    {envType: 'dev',runCommand: '', enable:0, configContent:'',repositoryId: '',repositoryNamespace: '',dockerRepository:{authConfigModel:{}}},
                    {envType: 'fat',runCommand: '', enable:0, configContent:'',repositoryId: '',repositoryNamespace: '',dockerRepository:{authConfigModel:{}}},
                    {envType: 'uat',runCommand: '', enable:0, configContent:'',repositoryId: '',repositoryNamespace: '',dockerRepository:{authConfigModel:{}}},
                    {envType: 'pro',runCommand: '', enable:0, configContent:'',repositoryId: '',repositoryNamespace: '',dockerRepository:{authConfigModel:{}}},
                ],
            }

        },

        //获取主机列表
        getAllHost() {
            this.$$api_cmdb_allHost({
                fn: json => {
                    this.allHost = json.data;
                }
            })
        },


        connectTest(row){
            this.$$api_cmdb_connectTest({
                data: {
                    hostId: row.hostId,
                    sshUser: row.sshUser,
                    sshKey: row.sshKey,
                },
                fn: json => {
                    this.$message({
                        message: 'Connect Success',
                        type: 'success'
                    });
                }
            });
        },

        saveData() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_cmdb_saveCluster({
                        data: this.saveForm,
                        fn: json => {
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.cleanSaveForm();
                            this.back();
                        },
                        errFn: () => {
                            this.dialogLoading = false;
                        }
                    });
                }else {
                    this.dialogLoading = false;
                }
            })
        },

        dataDetail(id) {
            this.$$api_cmdb_clusterDetail({
                data: {
                    id: id,
                },
                fn: json => {
                    if(json.data.deployType){
                        json.data.deployType = json.data.deployType.toString();
                    }
                    for(let i in json.data.environments){
                        if(!json.data.environments[i].dockerRepository){
                            json.data.environments[i].dockerRepository = {authConfigModel:{}};
                        }
                        if(!json.data.environments[i].dockerRepository.authConfigModel){
                            json.data.environments[i].dockerRepository.authConfigModel = {};
                        }
                    }
                    this.saveForm = json.data;
                }
            });
        },

        getSshs() {
            this.$$api_cmdb_getSshForSelect({
                data: {},
                fn: json => {
                    if(json.data){
                        this.sshs = json.data;
                    }
                },
            });
        },

        getDockerRepositorys() {
            this.$$api_cmdb_getDockerRepositoryForSelect({
                data: {},
                fn: json => {
                    if(json.data){
                        this.dockerRepositorys = json.data;
                    }
                },
            });
        },

        toInstancesPage(envType){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('cmdb:instance'),query: {
                clusterId: this.saveForm.id,envType:envType
                }})
        },

        getRepositoryProjects(repositoryId, address, name, cb){
            this.searchRepositoryProjectsLoading = true;
            this.$$api_cmdb_getRepositoryProjects({
                data: {
                    id: repositoryId,
                    address: address,
                    name: name,
                },
                fn: json => {
                    this.searchRepositoryProjectsLoading = false;
                    if(json.data){
                        // this.repositoryProjects = json.data;
                        // let results = [];
                        // for(let i in json.data){
                        //     results.push({value: json.data[i].name});
                        // }
                        if(!json.data || !(json.data instanceof Array)){
                            json.data = [];
                        }
                        cb(json.data);
                    }
                },
                errFn: () => {
                    this.searchRepositoryProjectsLoading = false;
                },

            });
        }


    }
}
