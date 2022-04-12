import {transDate, getDay} from 'utils/'

export default {
    name: 'host',
    data() {
        return {

            gatewayId: '',
            activeName: 'first',

            dialogLoading: false,

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                namespace: '',
                status: '1',
            },

            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'blur' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
            },
            loading: false
        }
    },


    activated() {
        this.gatewayId = this.$route.query.id;
        if(this.gatewayId){
            this.editData();
        }

    },

    mounted() {

    },

    methods: {


        cleanSaveForm() {
            this.saveForm = {
                id: '',
                name: '',
                namespace: '',
                status: '1',
            };
        },

        saveData() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_gw_saveGateway({
                        data: this.saveForm,
                        fn: json => {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
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

        editData() {
            if (!this.gatewayId) {
                return;
            }
            this.cleanSaveForm();
            this.$$api_gw_gatewayDetail({
                data: {
                    id: this.gatewayId,
                },
                fn: json => {
                    this.saveForm = json.data;
                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Edit Docker Cluster';
        },





    }
}
