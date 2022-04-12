import global from "../../../common/global_variable";

export default {
    name: 'file',
    data() {
        return {
            searchParams: {
                name: '',
                lang: '',
                labelId: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //列表Data
            tableData: [],
            labelData: [],

            dialogVisible: false,
            saveForm: {
                name: '',
                docCode: '',
                lang: '',
                labelIds: [],
                description: '',
                content: '',
                fileList: [],
            },

            uploadUrl: global.getBaseUrl(global.udm,false)+'/doc/upload',
            browseUrl: global.getBaseUrl(global.udm,false)+'/view/index.html',

            shareDialogVisible: false,
            shareText: '',

            shareConfirmDialogVisible: false,
            expireRadio: '',
            expireTimeDisable: true,
            shareConfirmForm:{
                isEncrypt: false,
                isForever: true,
                day: '',
                expireTime: '',
            },

            // 表单规则
            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
            },

        }
    },

    mounted() {

    },

    activated() {
        this.allLabel();
        this.getData();
    },

    methods: {
        onSubmit() {
            this.getData();
        },
        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },
        getData() {
            this.$$api_udm_docList({
                data: {
                    name: this.searchParams.name,
                    lang: this.searchParams.lang,
                    labelId: this.searchParams.labelId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                fn: json => {
                    this.total = json.data.total;
                    this.tableData = json.data.records;
                }
            })
        },
        add(){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('udm:file:edit')})
        },
        edit(row){
            this.$router.push({path:this.permitutil.getRoutePathByPermission('udm:file:edit'),query: {id: row.id}})
        },
        delData(row){
            if(!row){
                return;
            }
            this.$confirm('Confirm?', 'warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$$api_udm_delDoc({
                    data: {
                        id: row.id,
                    },
                    fn: json => {
                        this.getData();
                    }
                })
            }).catch(() => {
                //do nothing
            });
        },
        allLabel(){
            this.$$api_udm_allLabel({
                data: {},
                fn: json => {
                    this.labelData = json.data;
                }
            })
        },
        compareFile(row){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('udm:file:diff'),query: {docCode: row.docCode}})
        },
        uploadSuccess(response, file, fileList){
            console.debug(response);
            this.saveForm.content = response.data.path;
            this.saveForm.docCode = response.data.docCode;
        },
        uploadFail(err, file, fileList){
            this.$message.error('upload fail');
        },
        onExceed(files, fileList){
            this.$message.error('只能上传一个文件');
        },
        cleanSaveForm() {
            this.saveForm = {
                name: '',
                lang: '',
                labelIds: [],
                description: '',
                content: '',
                fileList: [],
            };
        },
        openUploadForm(){
            this.cleanSaveForm();
            this.dialogVisible = true;
        },
        saveData(){
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_udm_saveUpload({
                        data: this.saveForm,
                        fn: json => {
                            this.dialogVisible = false;
                            this.getData();
                            this.cleanSaveForm();
                        },
                    });
                }else {
                    this.dialogLoading = false;
                }
            });
        },
        browseFile(row){
            let url = this.browseUrl+"?code="+row.docCode
            if(row.passwd){
                url = url + "&passwd=" + row.passwd;
            }
            window.open(url, '_blank');
        },

        showShareConfirmForm(row){
            this.expireRadio = 1;
            this.shareConfirmForm = {//defalut
                id: row.id,
                isEncrypt: false,
                isForever: false,
                day: 1,
                expireTime: '',
            };
            this.expireTimeDisable = true;
            this.shareConfirmDialogVisible = true;
        },

        changeExpireRadio(){
            if(!this.expireRadio){
                return;
            }
            if(this.expireRadio===-1){
                this.shareConfirmForm.isForever = true;
                this.shareConfirmForm.day = '';
                this.shareConfirmForm.expireTime = '';
                this.expireTimeDisable = true;
            }else if(this.expireRadio===1){
                this.shareConfirmForm.isForever = false;
                this.shareConfirmForm.day = 1;
                this.shareConfirmForm.expireTime = '';
                this.expireTimeDisable = true;
            }else if(this.expireRadio===2){
                this.shareConfirmForm.isForever = false;
                this.shareConfirmForm.day = 7;
                this.shareConfirmForm.expireTime = '';
                this.expireTimeDisable = true;
            }else if(this.expireRadio===3){
                this.shareConfirmForm.isForever = false;
                this.shareConfirmForm.day = '';
                this.expireTimeDisable = false;
            }
        },

        shareDoc(isEncrypt){
            this.shareConfirmForm.isEncrypt = isEncrypt;
            this.$$api_udm_shareDoc({
                data: this.shareConfirmForm,
                fn: json => {
                    this.showShareInfo(json.data);
                    this.shareConfirmDialogVisible = false;
                },
            });
        },

        showShareInfo(data){
            //e.g: 链接:https://pan.baidu.com/s/aaaaaaaaaaaaaaaaa  密码:k2hn
            this.shareText = '链接:'+this.browseUrl+"?code="+data.docCode;
            if(data.passwd){
                this.shareText = this.shareText + ' 密码:' + data.passwd;
            }
            this.shareDialogVisible = true;
        },
        onCopySuccess(){
            this.$message({
                message: '复制成功',
                type: 'success'
            });
        }

    },
}


