import { transDate, getDay } from 'utils/'
import de from "element-ui/src/locale/lang/de";
import global from "../../../common/global_variable";

export default {
    name: 'host',
    data() {
        return {
            //查询条件
            searchParams: {
                name: '',
                hostname: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            //弹窗表单
            saveForm: {
                id: '',
                name: '',
                hostname: '',
                idcId: '',
                sshIds: [],
            },

            dialogVisible: false,
            dialogTitle: '',
            dialogLoading: false,

            tableData: [],

            idcs: [],
            sshs: [],

            testConnectDialogVisible: false,
            testConnect: {
                hostId: '',
                sshId: {},
            },
            connecting: false,


            // 表单规则
            rules: {
                name: [
                    { required: true, message: 'Please Input name', trigger: 'blur' },
                    { min: 1, max: 50, message: 'length between 1 to 50', trigger: 'blur' }
                ],
                hostname: [
                    { required: true, message: 'Please Input hostname', trigger: 'blur' },
                    { min: 1, max: 30, message: 'length between 1 to 100', trigger: 'blur' }
                ],
            },
            loading: false,

            importDialogVisible: false,
            downloadTemplateUrl: global.getBaseUrl(global.cmdb, false) + '/host/createAndDownloadTemplate',
            uploadImportFileUrl: global.getBaseUrl(global.cmdb, false) + '/host/importHost',
            uploadHeaders: {},


            importForm: {
                idcId: '',
                organizationCode: '',
                fileList: [],
            },

            uploadData: {
                force: 0,
                sshAutoCreate: 0,
            },

            uploading: false,


        }
    },

    mounted() {
        this.getData();
        this.getIdcForSelect();
        this.getSshForSelect();


    },

    methods: {

        onSubmit() {
            this.pageNum = 1;
            this.getData();
        },

        currentChange(i) {
            this.pageNum = i;
            this.getData();
        },

        addData() {

            this.getSshForSelect();
            this.getIdcForSelect();

            this.cleanSaveForm();
            this.dialogVisible = true;
            this.dialogTitle = 'Add VCS information';
        },


        handleCommand(command) {
            const action = command.action;
            const row = command.row;
            if (action === 'editData') {
                this.editData(row)
            } else if (action === 'toNetcard') {
                this.toNetcard(row);
            } else if (action === 'delData') {
                this.delData(row);
            }
        },

        // 获取列表数据
        getData() {
            this.loading = true;
            this.$$api_cmdb_hostList({
                data: {
                    name: this.searchParams.name,
                    hostname: this.searchParams.hostname,
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
                hostname: '',
                idcId: '',
                sshIds: [],
            };
        },

        saveData() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_cmdb_saveHost({
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
                } else {
                    this.dialogLoading = false;
                }
            });
        },

        editData(row) {
            if (!row.id) {
                return;
            }
            this.cleanSaveForm();
            this.$$api_cmdb_hostDetail({
                data: {
                    id: row.id,
                },
                fn: json => {
                    this.saveForm = json.data;
                    if (!this.saveForm.sshIds) {
                        this.saveForm.sshIds = [];
                    }
                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Configure Host';
        },

        getIdcForSelect() {
            this.$$api_cmdb_getIdcForSelect({
                data: {},
                fn: json => {
                    this.idcs = json.data;
                },
            });
        },
        getSshForSelect() {
            this.$$api_cmdb_getSshForSelect({
                data: {},
                fn: json => {
                    this.sshs = [];
                    for (let i = 0; i < json.data.length; i++) {
                        this.sshs.push({
                            label: json.data[i].name,
                            key: json.data[i].id,
                        });
                    }
                },
            });
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
                this.$$api_cmdb_delHost({
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

        toNetcard(row) {
            this.$router.push({ path: this.permitutil.getRoutePathByPermission('cmdb:netcard'), query: { id: row.id } })
        },

        openTestConnect(row) {
            this.testConnect.hostId = row.id;
            this.testConnectDialogVisible = true;
        },

        testConnecting() {
            this.$$api_cmdb_connectTest({
                data: {
                    hostId: this.testConnect.hostId,
                    sshId: this.testConnect.sshId,
                },
                fn: json => {
                    this.$message({
                        message: 'Connect Success',
                        type: 'success'
                    });
                },
            });
        },

        openImportDialog() {
            this.importForm = {
                idcId: '',
                organizationCode: '',
                fileList: [],
            };

            this.uploadData = {
                force: 0,
                sshAutoCreate: 0,
            };
            this.uploading = false;
            this.importDialogVisible = true;
        },

        downloadTemplate() {
            if (!this.importForm.idcId || !this.importForm.organizationCode) {
                return;
            }
            let url = this.downloadTemplateUrl + "?idcId=" + this.importForm.idcId + "&organizationCode=" + this.importForm.organizationCode
            window.open(url, '_blank');
        },

        importHost() {
            // Temporary
            var iamCore = new IAMCore({
                deploy: {
                    defaultTwoDomain: "erm",
                    defaultServerPort: 14051,
                    defaultContextPath: "/erm-manager",
                }
            });
            var replayToken = iamCore.generateReplayToken();
            this.uploadHeaders[replayToken.headerName] = replayToken.value;
            var xsrfToken = iamCore.getXsrfToken();
            this.uploadHeaders[xsrfToken.headerName] = xsrfToken.value;
            this.$refs.upload.submit();
            this.uploading = true;
        },

        uploadSuccess(response, file, fileList) {
            //this.confirmForm.annex = response.data
            let success = response.data.success;
            let fail = response.data.fail;
            let message = 'import success:' + success + ';import fail:' + fail;
            if (success == 0) {
                this.$message.error(message);
            } else if (fail == 0) {
                this.$message.success(message);
            } else {
                this.$message.warning(message);
            }
            this.importDialogVisible = false;
            this.uploading = false;
        },
        uploadFail(err, file, fileList) {
            this.$message.error('upload fail');
            this.importDialogVisible = false;
            this.uploading = false;
        }
    }
}
