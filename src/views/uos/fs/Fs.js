import global from "../../../common/global_variable";
import de from "element-ui/src/locale/lang/de";
import RightPanel from '@/components/RightPanel'

export default {
    name: 'Fs',
    components: {
        RightPanel,
    },
    data() {
        return {
            currentPath: '/',
            routePath: [{
                name: '/',
                path: '/',
            }],

            loading: false,

            //查询条件
            searchParams: {
                cossProvider: '',
                bucketName: '',
                prefix: '',
            },

            //分页信息
            total: 0,
            pageNum: 1,
            pageSize: 10,

            fistRow: [],
            tableData: [],

            detailDialog: false,

            uploadDialog: false,
            fileList: [],
            uploadUrl: global.getBaseUrl(global.uos, false) + '/webservice/putObject',
            uploadData: {
                cossProvider: '',
                bucketName: '',
                key: '',
                //
                uploadToType: '1',
                uploadPath: '',
                acl: 'default',
            },

            acls: [],

            aclDialog: false,
            aclForm: {
                acl: '',
                realAcl: '',
                key: '',
            },

            detailData: {
                metadata: {},
                downloadUrl: '',
                expireSec: 32400,
            },

            createDrDialog: false,
            dirName: '',

            headDialog: false,
            headForm: {
                contentType: '',
                contentEncoding: '',
                contentDisposition: '',
                cacheControl: '',
                etime: '',
                userMetadata: [],
            },

            targetBuckets: [],
            targetBucket: '',
            targetObject: '',
            bucketList: [],

            shareData: {},

            previewDialog: false,

            selectObjectContentDialog: false,
            selectObjectContentData: {
                cossProvider: '',
                bucketName: '',

                key: '',
                type: 'JSON',
                recordDelimiter: ',',
                recordDelimiter1: ',',
                recordDelimiter2: '',
                compressionType: 'NONE',
                useFileHeaderInfo: false,
                jsonType: 'DOCUMENT',
                sqlExpression: '',
                result: '',
            },

            helpDialog: false,


        }
    },

    mounted() {

    },

    activated() {
        this.searchParams.cossProvider = this.$route.query.cossProvider;
        this.searchParams.bucketName = this.$route.query.bucketName;
        this.currentPath = '/';

        this.getData();
        this.getListBuckets();
        //this.getACLs();
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
        // 获取列表数据
        getData() {
            this.total = 4;
            this.loading = true;
            this.$$api_uos_listObjects({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    prefix: this.currentPath + this.searchParams.prefix,
                    bucketName: this.searchParams.bucketName,
                    marker: null,//TODO
                    maxKeys: 10,
                }, fn: json => {
                    this.tableData = [
                        {key: ['/', json.data.bucketName]},
                    ];
                    this.tableData = this.tableData.concat(json.data.objectSummaries);
                    console.info(this.tableData);
                    this.loading = false;
                }
            });
        },


        getListBuckets() {
            this.$$api_uos_listBuckets({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    marker: null,//TODO
                    maxKeys: 10,
                }, fn: json => {
                    this.bucketList = json.data.bucketList;
                }
            });
        },


        nextPath(subPath) {
            this.currentPath = this.currentPath + subPath;
            this.routePath.push({
                name: subPath,
                path: this.currentPath,
            });
            this.getData();
        },

        prePath() {
            if (this.currentPath.length <= 1) {
                this.currentPath = "/";
                this.getData();
            } else {
                const str = this.currentPath.substring(0, this.currentPath.length - 1);
                const i = str.lastIndexOf("/");
                this.currentPath = str.substring(0, i + 1);
                this.routePath.splice(this.routePath.length - 1, 1);
                this.getData();
            }


        },

        isDir(key) {
            const i = key.lastIndexOf("/");
            if (i > 0 && i === key.length - 1) {
                return true;
            } else {
                return false;
            }
        },

        changePath(path) {
            this.currentPath = path;
            this.getData();

            const paths = path.split('/');
            this.routePath = [{
                name: '/',
                path: '/',
            }];
            let temp = '/';
            for (let i in paths) {
                if (paths[i] === '') {
                    continue;
                }
                temp = temp + paths[i] + '/';
                this.routePath.push({
                    name: paths[i] + '/',
                    path: temp,
                })
            }

        },

        arraySpanMethod({row, column, rowIndex, columnIndex}) {
            if (rowIndex === 0) {
                if (columnIndex === 1) {
                    return [1, 7];
                } else if (columnIndex === 0) {
                    return [1, 1];
                } else {
                    return [0, 0];
                }
            }
            return [1, 1];
        },

        firstRowSelectable(row, index) {
            if (index === 0) {
                return false;
            } else {
                return true;
            }
        },

        handleCommand(command) {
            const action = command.action;
            const row = command.row;
            if (action === 'getAcl') {
                this.getAcl(this.currentPath + row.key, true, false)
            } else if (action === 'deleteObject') {
                this.deleteObject(row);
            } else if (action === 'shareObject') {
                this.shareObject(row);
            } else if (action === 'selectObjectContent') {
                this.openSelectObjectContentDialog(row);
            }
        },


        openOetailDialog(row) {
            if (row.key.endsWith("/")) {
                this.nextPath(row.key);
            } else {
                this.getObject(this.currentPath + row.key);
                this.detailDialog = true;
            }
        },

        back() {
            this.$router.push({path: this.permitutil.getRoutePathByPermission('coss:bucket:detail'), query: {cossProvider: this.searchParams.cossProvider, bucketName: this.searchParams.bucketName,}})
        },

        dateFormat(row, column) {
            var moment = require('moment');
            var date = row[column.property];
            if (!date || date === 0) {
                return "";
            }
            return moment(date).format("YYYY-MM-DD HH:mm:ss")
        },

        openUploadDialog() {
            this.uploadDialog = true;
            this.fileList = [];
            this.uploadData = {
                cossProvider: this.searchParams.cossProvider,
                bucketName: this.searchParams.bucketName,
                key: this.currentPath,
                uploadToType: '1',
                uploadPath: '',
                acl: 'default',

            }
        },
        submitUpload() {
            if (this.uploadData.uploadToType == 2) {
                this.uploadData.key = this.uploadData.uploadPath;
            }
            this.$refs.upload.submit();
        },
        beforeUpload(file) {

        },
        uploadSuccess(response, file, fileList) {
            console.info(response)
            this.$message.success('Success');
            this.uploadDialog = false;
            this.getData();
        },
        uploadFail(err, file, fileList) {
            this.$message.error(err);
        },
        onExceed(files, fileList) {
            this.$message.error('最多只能同时上传个文件');
        },

        deleteObject(row) {
            this.$confirm('confirm?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$$api_uos_deleteObject({
                    data: {
                        cossProvider: this.searchParams.cossProvider,
                        bucketName: this.searchParams.bucketName,
                        key: row.key,
                    }, fn: json => {
                        this.$message({
                            type: 'success',
                            message: 'Success'
                        });
                        this.getData();
                    }
                });
            }).catch(() => {

            });
        },

        getACLs() {
            this.$$api_uos_getACLs({
                data: {},
                fn: json => {
                    this.acls = json.data;
                }
            });
        },


        getAcl(key, openDialog, shareObject) {
            this.aclForm = {
                acl: '',
                realAcl: '',
                key: '',
            },
                this.$$api_uos_getObjectAcl({
                    data: {
                        cossProvider: this.searchParams.cossProvider,
                        bucketName: this.searchParams.bucketName,
                        key: key,
                    }, fn: json => {
                        this.aclForm.acl = json.data.acl;
                        this.aclForm.realAcl = json.data.realAcl;
                        this.aclForm.key = key;
                        this.aclDialog = openDialog;

                        if (shareObject) {
                            this.shareObject(key);
                        }
                    }
                });
        },

        getRealPolicy() {
            if (this.aclForm.realAcl) {
                if (this.aclForm.realAcl == 'Default') {
                    return ''
                } else if (this.aclForm.realAcl == 'Private') {
                    return '(私有)'
                } else if (this.aclForm.realAcl == 'PublicRead') {
                    return '(公共读)'
                } else if (this.aclForm.realAcl == 'PublicReadWrite') {
                    return '(公共读写)'
                }
            }
            return '';
        },

        setAcl() {
            this.$$api_uos_setObjectAcl({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    bucketName: this.searchParams.bucketName,
                    key: this.aclForm.key,
                    acl: this.aclForm.acl,
                }, fn: json => {
                    this.aclDialog = false;
                    if (!this.isDir(this.aclForm.key)) {
                        this.getObject(this.aclForm.key);
                    }
                }
            });
        },

        getObject(key) {
            this.detailData = {
                metadata: {},
                expireSec: 32400,
            };
            this.shareData = {};
            this.$$api_uos_getObject({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    bucketName: this.searchParams.bucketName,
                    key: key,
                }, fn: json => {
                    json.data.expireSec = 32400;
                    this.detailData = json.data;
                    //this.detailData.downloadUrl = global.getBaseUrl(global.coss,false)+'/webservice/download' + "?bucketName=" +this.searchParams.bucketName +"&key="+key+"&cossProvider="+this.searchParams.cossProvider;
                    this.getAcl(key, false, true);
                    //this.shareObject(key);
                }
            });
        },

        openCreateDrDialog() {
            this.dirName = '';
            this.createDrDialog = true;
        },

        createDir() {
            this.$$api_uos_createDir({
                data: {
                    bucketName: this.searchParams.bucketName,
                    currentPath: this.currentPath,
                    dirName: this.dirName,
                }, fn: json => {
                    this.$message({
                        message: 'Success',
                        type: 'success'
                    });
                    this.createDrDialog = false;
                    this.getData();
                }
            });
        },

        onCopySuccess() {
            this.$message({
                message: '复制成功',
                type: 'success'
            });
        },

        getHead(key) {
            this.headDialog = true;
            this.modifyHead();
        },

        modifyHead() {
            if (!this.detailData || !this.detailData.metadata) {
                return;
            }
            this.headForm = {
                contentType: this.detailData.metadata.contentType,
                contentEncoding: this.detailData.metadata.contentEncoding,
                contentDisposition: this.detailData.metadata.contentDisposition,
                cacheControl: this.detailData.metadata.cacheControl,
                etime: this.detailData.metadata.etime,

                contentLength: this.detailData.metadata.contentLength,
                contentMd5: this.detailData.metadata.contentMd5,
                etag: this.detailData.metadata.etag,
                versionId: this.detailData.metadata.versionId,
                mtime: this.detailData.metadata.mtime,
                atime: this.detailData.metadata.atime,
                acl: this.detailData.metadata.acl,
            };
            //map ==> list
            this.headForm.userMetadata = []
            for (let key in this.detailData.metadata.userMetadata) {
                this.headForm.userMetadata.push({
                    name: key,
                    value: this.detailData.metadata.userMetadata[key],
                })
            }
        },

        addRow() {
            this.headForm.userMetadata.push({
                name: '',
                value: '',
            })
        },

        deleteRow(index) {
            this.headForm.userMetadata.splice(index, 1);
        },

        putObjectMetaData() {
            let map = {}
            this.headForm.userMetadata.forEach(row => {
                map[row.name] = row.value;
            })

            this.detailData.metadata = {

                bucketName: this.searchParams.bucketName,
                key: this.detailData.key,

                contentType: this.headForm.contentType,
                contentEncoding: this.headForm.contentEncoding,
                contentDisposition: this.headForm.contentDisposition,
                cacheControl: this.headForm.cacheControl,
                etime: this.headForm.etime,

                contentLength: this.headForm.contentLength,
                contentMd5: this.headForm.contentMd5,
                etag: this.headForm.etag,
                versionId: this.headForm.versionId,
                mtime: this.headForm.mtime,
                atime: this.headForm.atime,
                acl: this.headForm.acl,
            };
            this.detailData.metadata.param = {};
            this.detailData.metadata.param.cossProvider = this.searchParams.cossProvider;
            this.detailData.metadata.userMetadata = map;
            this.$$api_uos_putObjectMetaData({
                data: this.detailData.metadata,
                fn: json => {
                    this.$message({
                        message: 'Success',
                        type: 'success'
                    });
                    this.headDialog = false;
                    this.getObject(this.detailData.key);
                }
            });
        },

        copyObject(row) {
            this.$$api_uos_copyObject({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    sourceBucketName: this.searchParams.bucketName,
                    sourceKey: this.currentPath + row.key,
                    destinationBucketName: this.targetBucket,
                    destinationKey: this.targetObject,
                }, fn: json => {
                    this.$message({
                        message: 'Success',
                        type: 'success'
                    });
                    this.getData();
                }
            });
        },

        moveObject(row) {
            this.$$api_uos_moveObject({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    sourceBucketName: this.searchParams.bucketName,
                    sourceKey: this.currentPath + row.key,
                    destinationBucketName: this.targetBucket,
                    destinationKey: this.targetObject,

                }, fn: json => {
                    this.$message({
                        message: 'Success',
                        type: 'success'
                    });
                    this.getData();
                }
            });
        },

        isPresigned() {
            let presigned = false;
            if (this.aclForm.acl) {
                if (this.aclForm.acl === 'Private' || (this.aclForm.acl === 'Default' && (this.aclForm.realAcl === 'Private' || this.aclForm.realAcl === 'Default'))) {
                    presigned = true;
                }
            }
            return presigned;
        },

        shareObject(key) {
            if (!this.detailData.expireSec) {
                return
            }
            if (this.detailData.expireSec < 1) {
                this.detailData.expireSec = 1;
            }
            if (this.detailData.expireSec > 604800) {
                this.detailData.expireSec = 604800;
            }

            let presigned = this.isPresigned();

            this.$$api_uos_shareObject({
                data: {
                    cossProvider: this.searchParams.cossProvider,
                    bucketName: this.searchParams.bucketName,
                    key: key,
                    presigned: presigned,
                    expireSec: this.detailData.expireSec,

                }, fn: json => {
                    this.shareData = json.data;
                    this.isImageURL(json.data.url);
                }
            });
        },

        openSelectObjectContentDialog(row) {

            this.selectObjectContentData = {
                cossProvider: '',
                bucketName: '',
                type: 'JSON',
                key: '',
                recordDelimiter: ',',
                recordDelimiter1: ',',
                recordDelimiter2: '',
                compressionType: 'NONE',
                useFileHeaderInfo: false,
                jsonType: 'DOCUMENT',
                sqlExpression: '',
                result: '',
            };
            this.selectObjectContentDialog = true;
            this.selectObjectContentData.key = row.key;
        },

        selectObjectContent() {
            this.selectObjectContentData.cossProvider = this.searchParams.cossProvider;
            this.selectObjectContentData.bucketName = this.searchParams.bucketName;
            if(this.selectObjectContentData.recordDelimiter1 != ','){
                this.selectObjectContentData.recordDelimiter = this.selectObjectContentData.recordDelimiter2;
            }else{
                this.selectObjectContentData.recordDelimiter = this.selectObjectContentData.recordDelimiter1;
            }
            this.$$api_uos_selectObjectContent({
                data: this.selectObjectContentData,
                fn: json => {
                    this.selectObjectContentData.result = json.data;
                }
            });
        },

        isImageURL(url) {
            if (!url) {
                return false;
            }
            let i = url.indexOf("?");
            if (!i > 0) {
                return false;
            }
            url = url.substring(0, i);
            i = url.lastIndexOf(".");
            if (!i > 0 || i == url.length) {
                return false;
            }
            let t = url.substring(i + 1);
            t = t.toLowerCase();
            if (t == 'jpg' || t == 'bmp' || t == 'png' || t == 'jpeg' || t == 'tif' || t == 'gif') {
                return true;
            }
            return false;
        }


    },
}


