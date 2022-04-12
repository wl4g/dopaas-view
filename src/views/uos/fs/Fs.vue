<template>
    <div>
        <!--================================table================================-->
        <!-- 查询结果数值 -->
        <el-row>
            <el-col :span="16">
                <el-button @click="openUploadDialog" type="primary">上传文件</el-button>
                <!--<el-button @click="openCreateDrDialog" type="warning">新建目录</el-button>-->
                <el-button @click="getData" type="info">刷新</el-button>
            </el-col>
            <el-col :span="6">
                <el-input placeholder="prefix" v-model="searchParams.prefix" class="input-with-select" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                </el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="back" style='float:right;margin-right:20px'>{{$t('message.common.back')}}</el-button>
            </el-col>
        </el-row>


        <!-- 查询结果表格 -->
        <div>
            <template>
                <el-table :data="tableData" style="width:100%" :span-method="arraySpanMethod" v-loading="loading" :border="false">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection" :selectable="firstRowSelectable"></el-table-column>
                    <el-table-column prop="key" label="Key">
                        <template slot-scope="scope">
                            <div v-if="scope.$index===0">
                                <svg class="top-menu-iconfont" aria-hidden="true" style="cursor:pointer;" @click="prePath">
                                    <use xlink:href="#icon-fanhui"></use>
                                </svg>
                                &nbsp
                                <a v-for="item in routePath" @click="changePath(item.path)" style="font-size: 14px;cursor:pointer">
                                    {{item.name}}&nbsp
                                </a>
                            </div>
                            <div v-if="scope.$index!==0">
                                <a style="cursor:pointer" @click="openOetailDialog(scope.row)">
                                    <svg v-if="isDir(scope.row.key)" class="top-menu-iconfont" aria-hidden="true" style="cursor:pointer;">
                                        <use xlink:href="#icon-wenjianjia"></use>
                                    </svg>
                                    <svg v-if="!isDir(scope.row.key)" class="top-menu-iconfont" aria-hidden="true" style="cursor:pointer;">
                                        <use xlink:href="#icon-wenjian"></use>
                                    </svg>
                                    {{scope.row.key}}
                                </a>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" prop="size" :label="$t('message.coss.fileSize')"></el-table-column>

                    <el-table-column width="100" prop="storageType" :label="$t('message.common.type')">
                        <template slot-scope="{row}">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('coss_provider',row.storageType)">
                                {{dictutil.getDictLabelByTypeAndValue('coss_provider',row.storageType)}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" prop="owner.displayName" :label="$t('message.common.createBy')"></el-table-column>
                    <!--<el-table-column prop="atime" :label="$t('message.common.createDate')" :formatter="dateFormat"></el-table-column>-->
                    <el-table-column width="150" prop="mtime" :label="$t('message.common.updateDate')" :formatter="dateFormat"></el-table-column>


                    <el-table-column :label="$t('message.common.operation')" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="openOetailDialog(scope.row)">{{$t('message.common.detail')}}</el-button>
                            <el-dropdown @command="handleCommand" trigger="click">
                              <span class="el-dropdown-link">
                                  <el-button type="text">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                              </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="{action:'getAcl',row: scope.row}">{{$t('message.coss.acl')}}</el-dropdown-item>
                                    <el-dropdown-item :command="{action:'deleteObject',row: scope.row}">{{$t('message.common.del')}}</el-dropdown-item>
                                    <el-dropdown-item :command="{action:'selectObjectContent',row: scope.row}">选取内容</el-dropdown-item>
                                    <!--<el-dropdown-item :command="{action:'shareObject',row: scope.row}">分享</el-dropdown-item>-->
                                </el-dropdown-menu>
                            </el-dropdown>

                            <el-popover placement="bottom" width="400" v-model="scope.row.copyDialogVisible">
                                <p>请选择拷贝目标: </p>
                                <el-row>
                                    <el-col :span="6">
                                        <el-select v-model="targetBucket" placeholder="目标Bucket">
                                            <el-option
                                                    v-for="item in bucketList"
                                                    :key="item.name"
                                                    :label="item.name"
                                                    :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-input placeholder="目标Object" v-model="targetObject"></el-input>
                                    </el-col>
                                </el-row>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="scope.row.copyDialogVisible = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="scope.row.copyDialogVisible = false;copyObject(scope.row)">确定</el-button>
                                </div>
                                <el-button type="text" slot="reference" @click="targetBucket='';targetObject='';scope.row.copyDialogVisible = true">拷贝
                                </el-button>
                            </el-popover>

                            <el-popover placement="bottom" width="400" v-model="scope.row.moveDialogVisible">
                                <p>请选择拷贝目标: </p>
                                <el-row>
                                    <el-col :span="6">
                                        <el-select v-model="targetBucket" placeholder="目标Bucket">
                                            <el-option
                                                    v-for="item in bucketList"
                                                    :key="item.name"
                                                    :label="item.name"
                                                    :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-input placeholder="目标Object" v-model="targetObject"></el-input>
                                    </el-col>
                                </el-row>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="scope.row.moveDialogVisible = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="scope.row.moveDialogVisible = false;moveObject(scope.row)">确定</el-button>
                                </div>
                                <el-button type="text" slot="reference" @click="targetBucket='';targetObject='';scope.row.moveDialogVisible = true">移动
                                </el-button>
                            </el-popover>

                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>

        <right-panel :show="detailDialog" @close="detailDialog = false">

            <el-form label-width="100px" :model="detailData" ref="detailData">
                <img v-if="isImageURL(shareData.url)" :src="shareData.url" width="100%" height="100%" @click="previewDialog = true" style="cursor:pointer">
                <el-form-item label="文件名:" prop="name">
                    {{detailData.key}}
                </el-form-item>
                <el-form-item label="ETag:">
                    {{detailData.metadata.etag}}
                </el-form-item>

                <el-form-item label="链接有效时间(秒):" prop="expireSec" v-if="isPresigned()">
                    <el-input type="number" max=604800 min=1 v-model="detailData.expireSec" @change="shareObject(detailData.key)"></el-input>
                </el-form-item>

                <el-form-item label="URL:" prop="url">
                    <el-input readonly type="textarea" :value="shareData.url"></el-input>
                    <a style="cursor:pointer" :href="shareData.url">下载</a> &nbsp
                    <a style="cursor:pointer" :href="shareData.url" target="_blank">打开文件url</a> &nbsp
                    <a style="cursor:pointer" type="text" size="medium" v-clipboard:copy="shareData.url" v-clipboard:success="onCopySuccess">点击复制</a>
                </el-form-item>

                <el-form-item label="类型:" prop="type">
                    <el-row>
                        <el-col :span="6">&nbsp{{detailData.metadata.contentType}}&nbsp</el-col>
                        <el-col :offset="12" :span="6">
                            <a style="cursor:pointer" @click="getHead(detailData.key)">设置Http头</a>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="文件 ACL:" prop="acl">
                    <el-row>
                        <el-col :span="6">{{detailData.metadata.acl}}</el-col>
                        <el-col :offset="12" :span="6">
                            <a style="cursor:pointer" @click="getAcl(detailData.key, true, false)">设置读写权限</a>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="存储类型:" prop="saveType">
                    标准存储
                </el-form-item>
                <el-form-item label="服务器端加密:" prop="encrypt">
                    无
                </el-form-item>
            </el-form>
        </right-panel>


        <right-panel :show="selectObjectContentDialog" @close="selectObjectContentDialog = false" title="选取内容">
            <aside>
                <i class="el-icon-info"></i>
                通过 COSS Select，您可以使用 SQL 语句从单个 CSV 文件中提取记录。通过控制台，您可以针对 128MB 以下的文件，提取 40MB 以下的数据记录。如果您需要处理更大的文件或返回更多的记录，可以使用 API，<a style="cursor:pointer" @click="helpDialog=true">了解更多</a>。
            </aside>
            <el-form label-width="100px" :model="selectObjectContentData" ref="selectObjectContentData">
                <el-row>
                    <el-col :offset="1" :span="8">

                        <el-row>
                            <el-col :span="24">
                                <span>
                                    文件类型:
                                    <el-tooltip placement="top" popper-class="atooltip">
                                        <div slot="content">
                                            COSS Select 支持查询用逗号、制表符或其他字符分隔的文本文件。
                                            <a style="cursor:pointer; color: #409EFF" @click="helpDialog=true">了解更多</a>
                                        </div>
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-radio-group v-model="selectObjectContentData.type" >
                                    <el-radio :label="'CSV'">CSV</el-radio>
                                    <el-radio :label="'JSON'">JSON</el-radio>
                                    <el-radio :label="'Parquet'">Parquet</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-col>


                    <el-col :offset="2" :span="8" v-if="selectObjectContentData.type=='CSV'">

                        <el-row>
                            <el-col :span="24">
                                <span>分隔符:</span>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="24">
                                <el-radio-group v-model="selectObjectContentData.recordDelimiter1">
                                    <el-radio :label="','">,</el-radio>
                                    <el-radio :label="''">自定义
                                        <el-input :maxlength="1" :disabled="selectObjectContentData.recordDelimiter1==','" style="width: 60px"
                                                  v-model="selectObjectContentData.recordDelimiter2"></el-input>
                                    </el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>

                    </el-col>
                    <el-col :offset="2" :span="8" v-if="selectObjectContentData.type=='JSON'">

                        <el-row>
                            <el-col :span="24">
                                <span>JSON格式符:</span>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="24">
                                <el-radio-group v-model="selectObjectContentData.jsonType">
                                    <el-radio :label="'LINES'">JSON_LINES</el-radio>
                                    <el-radio :label="'DOCUMENT'">JSON_DOCUMENT</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :offset="1" :span="8">

                        <el-row>
                            <el-col :span="24">
                                <span>压缩格式:</span>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="12">
                                <el-radio-group v-model="selectObjectContentData.compressionType">
                                    <el-radio :label="'NONE'">NONE</el-radio>
                                    <el-radio :label="'GZIP'">GZIP</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :offset="2" :span="8" v-if="selectObjectContentData.type=='CSV'">

                        <el-row>
                            <el-col :span="24">
                                <span>分隔符:</span>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="24">
                                <el-checkbox v-model="selectObjectContentData.useFileHeaderInfo">备选项</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>


                <el-row style="margin-top: 18px">
                    <el-col :offset="1" :span="22">
                        <span>SQL编辑器:e.g: select * from S3Object limit 10
                            <el-tooltip placement="top" popper-class="atooltip">
                                <div slot="content">
                                    更多操作，请参见
                                    <a style="cursor:pointer" @click="helpDialog=true">操作指南</a>。
                                </div>
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </span>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :offset="1" :span="22">
                        <el-input type="textarea" :rows="3" v-model="selectObjectContentData.sqlExpression"></el-input>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :offset="1" :span="22">
                        <span style="position: relative;top: 20px"><b>执行结果</b></span>
                        <el-button type="primary" @click="selectObjectContent" style="float:right; margin-top: 10px;margin-bottom: 10px">执行</el-button>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :offset="1" :span="22">
                        <el-input readonly type="textarea" :rows="10" v-model="selectObjectContentData.result"></el-input>
                    </el-col>
                </el-row>

            </el-form>
        </right-panel>

        <el-dialog :close-on-click-modal="false" title="预览" :visible.sync="previewDialog" :fullscreen="true">
            <img v-if="isImageURL(shareData.url)" :src="shareData.url" width="100%" height="100%">
        </el-dialog>

        <el-dialog v-el-drag-dialog :close-on-click-modal="false"  top="5vh" :visible.sync="helpDialog" :modal="false" width="30%">
            <iframe width="100%" style="height: 80vh;border: medium none;" src="http://wl4g.debug/static/help/html/coss/select_detail.html"></iframe>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" title="上传" :visible.sync="uploadDialog" width="40%">
            <el-form label-width="100px" :model="uploadData" ref="uploadData">
                <el-form-item label="上传到:" prop="uploadPatj">
                    <el-radio-group v-model="uploadData.uploadToType">
                        <el-radio-button :label="1">当前目录</el-radio-button>
                        <el-radio-button :label="2">指定目录</el-radio-button>
                    </el-radio-group>
                    <el-input v-if="uploadData.uploadToType===2" v-model="uploadData.uploadPath" placeholder="path"></el-input>
                    <span v-if="uploadData.uploadToType===2">
                        <!--文件命名规范。。。。。。-->
                    </span>
                </el-form-item>

                <el-form-item label="文件 ACL:" prop="acl">
                    <el-radio-group v-model="uploadData.acl">
                        <el-radio-button
                                v-for="item in acls"
                                :label="item"
                                :value="item"
                                border>
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="上传文件" prop="file">
                    <el-upload
                            ref="upload"
                            drag
                            :with-credentials="true"
                            name="file"
                            class="upload-demo"
                            :limit="1"
                            :on-success="uploadSuccess"
                            :on-error="uploadFail"
                            :on-exceed="onExceed"
                            :before-upload="beforeUpload"
                            :action="uploadUrl"
                            :data="uploadData"
                            :auto-upload="false"
                            :file-list="fileList">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能同时上传一个文件，且不超过10Mb</div>
                        <!--<el-button size="small" type="primary">点击上传</el-button>-->
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitUpload">{{$t('message.common.save')}}</el-button>
                <el-button @click="uploadDialog = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" title="ACL" :visible.sync="aclDialog" width="30%">

            <el-radio-group v-model="aclForm.acl">
                <el-radio-button label="Default">继承{{getRealPolicy()}}</el-radio-button>
                <el-radio-button label="Private">私有</el-radio-button>
                <el-radio-button label="PublicRead">公共读</el-radio-button>
                <el-radio-button label="PublicReadWrite">公共读写</el-radio-button>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setAcl">{{$t('message.common.save')}}</el-button>
                <el-button @click="aclDialog = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" title="Create Dir" :visible.sync="createDrDialog" width="30%">
            <el-input v-model="dirName" placeholder="名字"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createDir">{{$t('message.common.save')}}</el-button>
                <el-button @click="createDrDialog = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" title="设置Http头" :visible.sync="headDialog" width="50%">
            <el-form label-width="150px" :model="headForm" ref="headForm">
                <el-form-item label="Content-Type" prop="contentType">
                    <el-input v-model="headForm.contentType"></el-input>
                </el-form-item>
                <el-form-item label="Content-Encoding" prop="contentEncoding">
                    <el-input v-model="headForm.contentEncoding"></el-input>
                </el-form-item>
                <el-form-item label="Content-Disposition" prop="contentDisposition">
                    <el-input v-model="headForm.contentDisposition"></el-input>
                </el-form-item>
                <el-form-item label="Cache-Control" prop="cacheControl">
                    <el-input v-model="headForm.cacheControl"></el-input>
                </el-form-item>
                <el-form-item label="Expires" prop="etime">
                    <el-input v-model="headForm.etime"></el-input>
                </el-form-item>

                <el-row>
                    <el-col :span="6">
                        用户自定义元数据
                    </el-col>
                    <el-col :offset="16" :span="2">
                        <el-button type="primary" @click="addRow()">添加</el-button>
                    </el-col>
                </el-row>

                <template>
                    <el-table :data="headForm.userMetadata" style="width: 100%" :border="false">
                        <!-- 动态标签 -->
                        <el-table-column prop="key" label="参数">
                            <template slot-scope="scope">
                                <el-input placeholder="请输入内容" v-model="scope.row.name">
                                    <template slot="prepend">x-oss-meta-</template>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="value" label="值">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column label="" width="50">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-button @click.native.prevent="deleteRow(scope.$index)" type="text">
                                        X
                                    </el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="putObjectMetaData">{{$t('message.common.save')}}</el-button>
                <el-button @click="headDialog = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import Fs from './Fs.js'

    export default Fs
</script>
<style>
    .el-radio__label{
        font-size: 12px !important;
        color: black !important;
        font-weight: 400;
    }
</style>

