import {transDate, getDay} from 'utils/'

export default {
    name: 'engineEdit',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
            },

            step: 1,
            idEdit: false,

            //弹窗表单
            saveForm: {
                //step1
                id: '',
                name: '',
                datasourceId: '',
                status: 1,
                notifyGroupIds:[],
                cron: '',
                remark: '',
                //step2
                notifyTemplate: '',
                arguments: '',
                codeContent: '',
            },

            dataSources: [],
            contactGroupData: [],
            checkResult: '',

            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                datasourceId: [
                    { required: true, message: 'Please select provider', trigger: 'change' },
                ],
                cron: [
                    { required: true, message: 'Please input cron', trigger: 'change' },
                ],
                notifyGroupIds: [
                    { required: true, message: 'Please select notifyGroups', trigger: 'change' },
                ],

            },
            loading: false
        }
    },

    activated() {
        this.step = 1;
        this.cleanSaveForm();
        this.getDataSources();
        this.getContactGroupData();
        this.saveForm.id = this.$route.query.id;
        if(this.saveForm.id){
            this.isEdit = true;
            this.editData(this.saveForm.id);
        }else{
            this.isEdit = false;
        }
    },

    methods: {


        cleanSaveForm() {
            this.saveForm = {
                id: '',
                name: '',
                datasourceId: '',
                status: 1,
                notifyGroupIds:[],
                cron: '',
                remark: '',

                notifyTemplate: '',
                arguments: '',
                codeContent: '',
            };
        },

        editData(id) {
            this.$$api_umc_engineDetail({
                data: {
                    id: id,
                },
                fn: json => {
                    this.saveForm = json.data;
                    if(!this.saveForm.notifyGroupIds){
                        this.saveForm.notifyGroupIds = [];
                    }
                }
            });
        },

        saveData() {
            this.dialogLoading = true;
            this.$$api_umc_saveEngine({
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
        },

        previousStep(){
            if(this.step>1){
                this.step -= 1;
            }else{
                this.back();
            }
        },
        nextStep(){
            if(this.step>=2){
                //TODO finish
                this.saveData();

                this.back();
                return;
            }
            if(this.step === 1){
                this.$refs['saveForm'].validate((valid) => {
                    if (valid) {
                        //next step
                        this.step += 1;
                    }
                });
            }

        },

        back(){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('umc:custom:engine')})
        },

        getContactGroupData() {
            this.$$api_iam_groupList({
                data: {},
                fn: json => {
                    this.contactGroupData = json.data;
                },
            })
        },

        getDataSources() {
            this.$$api_umc_dataSources({
                data: {},
                fn: json => {
                    this.dataSources = json.data;
                },
            })
        },

        checkCron() {
            this.$$api_umc_checkCron({
                data: {
                    expression: this.saveForm.cron,
                    numTimes: 5,
                },
                fn: json => {
                    if (json.data.validExpression) {
                        this.checkResult = json.data.nextExecTime;
                    } else {
                        this.checkResult = 'Expression unvalid';
                    }
                }
            })
        },


    }
}
