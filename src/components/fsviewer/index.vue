<template>
    <div style="height: 100%;box-sizing: border-box;" @contextmenu.prevent="(event) => {onContextmenuOnOutside(event)}">
        <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
        </el-input>
        <el-tree
                style=""
                class="fsviewer"
                ref="fsviewerref"
                :data="fileData"
                :default-expanded-keys="defaultExpandedKeys"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                node-key="path"
                draggable
                @node-expand="handleNodeExpand"
                @node-collapse="handleNodeCollapse"
                @node-drag-start="handleDragStart"
                @node-drag-enter="handleDragEnter"
                @node-drag-leave="handleDragLeave"
                @node-drag-over="handleDragOver"
                @node-drag-end="handleDragEnd"
                @node-drop="handleDrop"
                :allow-drop="allowDrop"
                :allow-drag="allowDrag">
            <div @dblclick="expandNode(node, data)" @click="clickFile(data)" slot-scope="{ node, data }"
                 style="width: 100%;height: 100%;display: flex;flex: 1;align-items: center;justify-content: space-between;"
                 @contextmenu.prevent.stop="(event) => {onContextmenu(event, data)}">
                <span>{{ node.label }}</span>
                <el-upload
                        :with-credentials="true"
                        name="file"
                        :before-upload="beforeUpload"
                        :data="uploadData"
                        :headers="uploadHeaders"
                        :on-error="uploadError"
                        :on-success="uploadSuccess"
                        :ref="'upload_'+ data.path"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :auto-upload="true">
                    <div slot="trigger" :ref="'uploadTrigger_'+data.path"></div>
                    <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
                </el-upload>

            </div>

        </el-tree>

        <div style=" width: 100%;height: 50px;"></div>

        <!--<div class="toggle-menu" @click='toggleMenu' style='left: 100px'>
            <i :class="show?'el-icon-arrow-left':'el-icon-arrow-right'"></i>
        </div>-->
    </div>

</template>

<script>
    import global from "@/common/global_variable";
    export default {
        name: 'fsviewer',
        props: {
            subPath: {
                default: '',
                type: String
            },
            getClusterContextmenus: {
                type: Function
            },

            clickNotClose: {
                default: false,
                type: Boolean
            },
            buttonTop: {
                default: 250,
                type: Number
            },
            show: {
                default: false,
                type: Boolean
            },
        },
        data() {
            return {

                filterText: '',
                defaultExpandedKeys: [],
                fileData: [],

                defaultProps: {
                    children: 'children',
                    label: 'fileName'
                },

                uploadUrl: global.getBaseUrl(global.doc,false)+'/fs/uploadFile',
                downloaddUrl: global.getBaseUrl(global.doc,false)+'/fs/downloadFile',
                uploadHeaders:{},
                uploadData: {
                    path: ''
                }
            }
        },
        computed: {},
        watch: {
            filterText(val) {
                this.$refs.fsviewerref.filter(val);
            }
        },
        mounted() {
            this.getTreeFiles();
        },
        beforeDestroy() {

        },
        methods: {

            getTreeFiles(){
                this.$$api_udm_getTreeFiles({
                    data: {
                        subPath: this.subPath
                    },
                    fn: json => {
                        this.fileData = json.data;
                    },
                    errFn: () => {

                    }
                })
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.fileName.indexOf(value) !== -1;
            },

            isDir(data){
                return data.isDir;
            },

            //==================== 展开节点(start) ====================

            expandNode(node, data) {
                node.expanded = !node.expanded;
            },
            //==================== 展开节点(end) ====================


            //==================== 记录展开节点(start) ====================
            // 树节点展开
            handleNodeExpand (data) {
                // 保存当前展开的节点
                let flag = false
                this.defaultExpandedKeys.some(item => {
                    if (item === data.path) { // 判断当前节点是否存在， 存在不做处理
                        flag = true
                        return true
                    }
                })
                if (!flag) { // 不存在则存到数组里
                    this.defaultExpandedKeys.push(data.path)
                }
                console.info(this.defaultExpandedKeys)
            },
            // 树节点关闭
            handleNodeCollapse (data) {
                this.defaultExpandedKeys.some((item, i) => {
                    if (item === data.path) {
                        // 删除关闭节点
                        this.defaultExpandedKeys.length = i
                    }
                })
            },
            //==================== 记录展开节点(end) ====================


            //==================== 拖拽事件(start) ====================
            handleDragStart(node, ev) {
                console.log('drag start', node);
            },
            handleDragEnter(draggingNode, dropNode, ev) {
                console.log('tree drag enter: ', dropNode.label);
            },
            handleDragLeave(draggingNode, dropNode, ev) {
                console.log('tree drag leave: ', dropNode.label);
            },
            handleDragOver(draggingNode, dropNode, ev) {
                console.log('tree drag over: ', dropNode.label);
            },
            handleDragEnd(draggingNode, dropNode, dropType, ev) {
                console.log('tree drag end: ', dropNode && dropNode.label, dropType);
            },
            handleDrop(draggingNode, dropNode, dropType, ev) {
                console.log('tree drop: ', dropNode.label, dropType);
            },
            //是否允许放置
            allowDrop(draggingNode, dropNode, type) {
                /*if (dropNode.data.label === '二级 3-1') {
                    return type !== 'inner';
                } else {
                    return true;
                }*/
                return true;
            },
            //是否允许拖动
            allowDrag(draggingNode) {
                //return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
                return true;
            },
            //==================== 拖拽事件(end) ====================

            //==================== 右键点击事件(start) ====================
            onContextmenu(event,data) {
                let that = this;
                console.info(data);
                this.$contextmenu({
                    items: [
                        {
                            label: "新建文件",
                            onClick: () => {
                                this.$prompt('请输入名称', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then(({ value }) => {
                                    this.addFile(data.path + '/' +value)
                                }).catch(() => {
                                    //do nothing
                                });
                            },
                            disabled: !data.dir
                        },
                        {
                            label: "新建文件夹",
                            onClick: () => {
                                this.$prompt('请输入名称', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then(({ value }) => {
                                    this.addDir(data.path + '/' + value)
                                }).catch(() => {
                                    //do nothing
                                });
                            },
                            disabled: !data.dir,
                            divided: true,
                        },
                        {
                            label: "上传",
                            onClick: () => {
                                //debugger
                                //that.$refs.upload.submit();
                                //that.$refs['uploadTrigger_'+data.path].click();
                                this.uploadData.path = data.path;
                                this.uploadData = {
                                    path: data.path,
                                    subPath: that.subPath
                                };
                                that.$refs['upload_'+data.path].$children[0].$refs.input.click();
                            },
                            disabled: !data.dir
                        },
                        /*{
                            label: "使用网页翻译(T)",
                            divided: true,
                            minWidth: 0,
                            children: [{ label: "翻译成简体中文" }, { label: "翻译成繁体中文" }]
                        },*/
                        {
                            label: "重命名",
                            onClick: () => {
                                this.$prompt('请输入名称', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    inputPlaceholder: data.fileName,
                                    inputValue: data.fileName,
                                }).then(({ value }) => {
                                    let parentPath = data.path.substring(0, data.path.lastIndexOf('/'));
                                    if(!parentPath){
                                        parentPath = '';
                                    }
                                    this.renameFile(data.path, parentPath + '/' + value);
                                }).catch(() => {
                                    //do nothing
                                });

                            },
                        },
                        {
                            label: "下载",
                            //icon: "el-icon-delete",
                            onClick: () => {
                                window.location.href = this.downloaddUrl+ '?path='+ data.path+ '&subPath='+ that.subPath;
                            },
                        },
                        {
                            label: "删除",
                            icon: "el-icon-delete",
                            onClick: () => {
                                this.del(data.path);
                            },
                        },
                    ].concat(that.getClusterContextmenus?that.getClusterContextmenus(data):[]),
                    event,
                    //x: event.clientX,
                    //y: event.clientY,
                    customClass: "class-a",
                    zIndex: 3,
                    minWidth: 230
                });
                return false;
            },

            onContextmenuOnOutside(event) {
                console.info('into onContextmenu2');
                this.$contextmenu({
                    items: [
                        {
                            label: "新建文件",
                            onClick: () => {
                                this.$prompt('请输入名称', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then(({ value }) => {
                                    this.addFile('/'+value)
                                }).catch(() => {
                                    //do nothing
                                });
                            },
                        },
                        {
                            label: "新建文件夹",
                            onClick: () => {
                                this.$prompt('请输入名称', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then(({ value }) => {
                                    this.addDir('/'+value)
                                }).catch(() => {
                                    //do nothing
                                });
                            },
                        },
                    ],
                    event,
                    //x: event.clientX,
                    //y: event.clientY,
                    customClass: "class-a",
                    zIndex: 3,
                    minWidth: 230
                });
                return false;
            },
            //==================== 右键点击事件(end) ====================


            //==================== 操作事件(start) ====================
            addDir(path){
                this.$$api_udm_addDir({
                    data: {
                        subPath: this.subPath,
                        path: path
                    },
                    fn: json => {
                        this.$message({
                            message: 'Success',
                            type: 'success'
                        });
                        this.getTreeFiles();
                    },
                    errFn: () => {
                        this.$message.error('Fail');
                    }
                })
            },

            addFile(path){
                this.$$api_udm_addFile({
                    data: {
                        subPath: this.subPath,
                        path: path
                    },
                    fn: json => {
                        this.$message({
                            message: 'Success',
                            type: 'success'
                        });
                        this.getTreeFiles();
                    },
                    errFn: () => {
                        this.$message.error('Fail');
                    }
                })
            },

            renameFile(path, toPath){
                this.$$api_udm_renameFile({
                    data: {
                        subPath: this.subPath,
                        path: path,
                        toPath: toPath,
                    },
                    fn: json => {
                        this.$message({
                            message: 'Success',
                            type: 'success'
                        });
                        this.getTreeFiles();
                    },
                    errFn: () => {
                        this.$message.error('Fail');
                    }
                })
            },


            del(path){
                //console.info(note,data)
                this.$$api_udm_delFile({
                    data: {
                        subPath: this.subPath,
                        path: path
                    },
                    fn: json => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getTreeFiles();
                    },
                    errFn: () => {
                        this.$message.error('删除失败');
                    }
                })
            },

            //==================== 操作事件(end) ====================


            beforeUpload(){
                var iamCore = new IAMCore({
                    deploy: {
                        defaultTwoDomain: "doc",
                        defaultServerPort: 14060,
                        defaultContextPath: "/doc-manager",
                    }
                });
                var replayToken = iamCore.generateReplayToken();
                this.uploadHeaders[replayToken.headerName] = replayToken.value;
                var xsrfToken = iamCore.getXsrfToken();
                this.uploadHeaders[xsrfToken.headerName] = xsrfToken.value;
            },

            uploadSuccess(){
                this.$message({
                    message: 'Success',
                    type: 'success'
                });
                this.getTreeFiles();
            },
            uploadError(){
                this.$message.error('Fail');
            },

            clickFile(data){
                if(data.dir){
                    return;
                }
                this.$emit('openFile',data.path);
            },

        }
    }
</script>

<style>
    .el-upload__input {
        display: none !important;
    }


</style>

<style lang="scss" scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .toggle-menu{
        height: 66px;
        position: absolute;
        top: 50%;
        z-index: 1000;
        transform: translate(2px, -50%);
        cursor: pointer;
        text-align: center;
        color: #fff;
        font-size: 12px;
        opacity: .7;
        transition: all 0.3s ease-out;
        border-bottom: 8px solid transparent;
        border-right: none;
        border-left: 12px solid #EBEBEB;
        border-top: 8px solid transparent;
    }

</style>
