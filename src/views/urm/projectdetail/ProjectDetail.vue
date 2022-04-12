<template>
    <section id="configuration" class="configuration">
        <el-card class="box-card">
            <div slot="header">
                <span style="font-size: 40px;background: #8cc5ff">&nbsp;{{projectDetail.name.split('')[0]}}&nbsp;</span>

                <span style="font-size: 20px">{{projectDetail.name}}</span>
                <span style="font-size: 10px;color: #8c8c8c">Project ID: {{projectDetail.id}}</span>
                <el-button style="float: right; margin-right:10px" type="primary" @click="back">{{$t('message.common.back')}}</el-button>
                <el-dropdown @command="handleCommand" style="float: right; margin-right:10px">
                    <el-button type="primary">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">New Branch</el-dropdown-item>
                        <el-dropdown-item command="b">New Tag</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span v-if="projectDetail.owner" style="font-size: 10px;color: #8c8c8c;float: right; margin-right:10px">({{projectDetail.owner.username}}:{{projectDetail.owner.id}})</span>
                <span v-if="projectDetail.owner" style="font-size: 20px;float: right; margin-right:10px">{{projectDetail.owner.name}}</span>

            </div>
            <el-row>
                <el-col :span="4">
                    <a style="cursor:pointer" @click="activeCard = 'first'">
                        {{branchs.length}} Branchs
                    </a>
                </el-col>

                <el-col :span="4">
                    <a style="cursor:pointer" @click="activeCard = 'second'">
                        {{tags.length}} Tags
                    </a>
                </el-col>

                <el-col :span="4">
                    <el-tag>default:</el-tag>{{projectDetail.default_branch}}
                </el-col>

                <el-col :span="4">
                    可见度:{{projectDetail.visibility}}
                </el-col>

                <el-col :span="6">
                    修改时间:{{dateformat(projectDetail.last_activity_at)}}
                </el-col>

                <el-col :span="2">

                    <el-popover placement="bottom" width="300" v-model="clonevVisible">
                        <p>Clone with SSH</p>
                        <el-input v-model="projectDetail.ssh_url_to_repo" readonly>
                            <el-button slot="append" icon="el-icon-tickets" v-clipboard:copy="projectDetail.ssh_url_to_repo" v-clipboard:success="onCopySuccess"></el-button>
                        </el-input>
                        <p>Clone with Http</p>
                        <el-input v-model="projectDetail.http_url_to_repo" readonly>
                            <el-button slot="append" icon="el-icon-tickets" v-clipboard:copy="projectDetail.http_url_to_repo" v-clipboard:success="onCopySuccess"></el-button>
                        </el-input>

                        <el-button type="warning" slot="reference">clone<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                    </el-popover>

                </el-col>
            </el-row>

            <el-row v-if="projectDetail.description">
                <el-col :span="24">
                    描述:{{projectDetail.description}}
                </el-col>
            </el-row>

        </el-card>


        <template>
            <el-tabs v-model="activeCard" type="border-card">


                <el-tab-pane label="branch信息" name="first">
                    <el-table :data="branchs" :border="false" style="width:100%">
                        <el-table-column prop="name" label="分支名"></el-table-column>
                        <el-table-column prop="commit.created_at" label="提交日期" :formatter="dateformat2"></el-table-column>
                        <el-table-column prop="commit.committer_name" label="提交者"></el-table-column>
                        <el-table-column prop="commit.committer_email" label="提交者邮箱"></el-table-column>
                        <el-table-column prop="merged" label="merged">
                            <template slot-scope="{ row }">
                                <i class="el-icon-check" v-if="row.merged"></i>
                                <i class="el-icon-close" v-if="!row.merged"></i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="protected" label="protected">
                            <template slot-scope="{ row }">
                                <i class="el-icon-check" v-if="row.protected"></i>
                                <i class="el-icon-close" v-if="!row.protected"></i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="commit.message" label="Message" :show-overflow-tooltip="true"></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="tag信息" name="second">
                    <el-table :data="tags" :border="false" style="width:100%">
                        <el-table-column prop="name" label="分支名"></el-table-column>
                        <el-table-column prop="commit.created_at" label="创建日期" :formatter="dateformat2"></el-table-column>
                        <el-table-column prop="commit.author_name" label="作者"></el-table-column>
                        <el-table-column prop="commit.author_email" label="作者邮箱"></el-table-column>
                        <el-table-column prop="message" label="Message" :show-overflow-tooltip="true"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </template>

        <el-dialog :close-on-click-modal="false" title="Add Branch" :visible.sync="newBranchDialog" width="40%">
            <el-form label-width="80px" :model="newBranchForm" ref="newBranchForm" class="demo-form-inline">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Ref" prop="ref">
                            <el-select v-model="newBranchForm.ref">
                                <el-option
                                        v-for="item in branchs"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Branch" prop="branch">
                            <el-input v-model="newBranchForm.branch" placeholder="e.g: 0.1.1-RC5-ci"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createBranch()">{{$t('message.common.save')}}</el-button>
                <el-button @click="newBranchDialog = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" title="Add Tag" :visible.sync="newTagDialog" width="40%">
            <el-form label-width="80px" :model="newTagForm" ref="newTagForm" class="demo-form-inline">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Ref" prop="ref">
                            <el-select v-model="newTagForm.ref">
                                <el-option
                                        v-for="item in branchs"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Tag" prop="tag">
                            <el-input v-model="newTagForm.tag" placeholder="e.g: v1.1.0-RC1-200415-base"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="Message" prop="message">
                            <el-input type="textarea" v-model="newTagForm.message"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createTag()">{{$t('message.common.save')}}</el-button>
                <el-button @click="newTagDialog = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>

    </section>
</template>


<script>
    import ProjectDetail from './ProjectDetail.js'

    export default ProjectDetail
</script>

<style scoped>

</style>

