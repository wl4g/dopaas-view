<template>
  <div id="configuration"  class="configuration">
    <!-- //表单 -->
    <el-form :inline="true" :model="formInline" class="searchbar">

      <el-form-item :label="$t('message.common.group')">

        <!--<el-select v-model="formInline.region" placeholder="请选择Group:">
          <el-option label="sso" value="sso"></el-option>
          <el-option label="portal" value="portal"></el-option>
        </el-select>-->
        <el-select v-model="formInline.group" @change="getinstance(0)">
            <el-option label="ALL" value=""></el-option>
            <el-option
                v-for="item in groupData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('message.ci.env')">
        <el-select v-model="formInline.environment" @change="getinstance(0)">
          <el-option label="ALL" value=""></el-option>
            <el-option
                    v-for="item in dictutil.getDictListByType('app_ns_type')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('message.ci.instances')">
        <el-select v-model="formInline.instance">
          <el-option label="ALL" value=""></el-option>
          <el-option
                v-for="item in instanceData"
                :key="item.id"
                :label="item.hostname"
                :value="item.id">
          </el-option>
        </el-select>
        <!-- <el-input v-model="formInline.user" placeholder=""></el-input>  -->
      </el-form-item>

      <el-form-item>
        <el-button type="success" @click="onSubmit" :loading="loading">{{$t('message.common.search')}}</el-button>
      </el-form-item>
      <el-form-item style='float:right'>
        <!-- 新增按钮 -->
        <el-button type="primary" @click="addOne()">{{$t('message.common.add')}}</el-button>

      </el-form-item>
    </el-form>
    <!-- 查询结果数值 -->
    <div class="query">
      <div class="query-left">
        <div class="line"></div>
        Result Total： <span class="number">{{total}}</span>
      </div>
    </div>
    <!-- 查询结果表格 -->
    <div>
      <template>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            :label="$t('message.common.selectAll')"
            type="selection"
            min-width="40">
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
             min-width="50"
             >
          </el-table-column>
           <el-table-column
            prop="groupName"
            :label="$t('message.common.group')"
             >
          </el-table-column>
          <el-table-column
            prop="envType"
            :label="$t('message.ci.env')"

             >
          </el-table-column>
          <el-table-column
            prop="host"
            :label="$t('message.iam.host')"
            min-width="190"
             >
          </el-table-column>
          <!--<el-table-column
             min-width="90"
            prop="ip"
            label="IP"
             >
          </el-table-column>-->
           <el-table-column
            prop="port"
            :label="$t('message.scm.port')"
             >
          </el-table-column>
          <el-table-column
            prop="remark"
            :label="$t('message.common.remark')"
            min-width="120"
             >
          </el-table-column>
          <el-table-column
            :label="$t('message.common.operation')"
            min-width="120">
            <template slot-scope="scope">
              <el-button type="info" @click="addOne(1,scope.row)">{{$t('message.common.edit')}}</el-button>
              <el-button @click="details(scope.row)" type="info" >{{$t('message.common.detail')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change='currentChange'
          >
  </el-pagination>

    <!-- 新增弹出窗口 -->
    <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="80%"
            custom-class="tanchuang"
            @close='selectdisabled=false;if(!isedit){instancelist=[]}'
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-form-inline">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('message.common.group')" prop="group" >
              <el-select v-model="ruleForm.group"  @change="getinstance(1)" placeholder="Please group" v-bind:disabled="isedit">
                <el-option
                        v-for="item in groupData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$t('message.ci.env')" prop="environment">
              <el-select v-model="ruleForm.environment" @change="getinstance(1)" placeholder="Please environment" >
                <el-option
                        v-for="item in dictutil.getDictListByType('app_ns_type')"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$t('message.scm.node')" prop="instance" >
              <el-select v-model="ruleForm.instance" placeholder="Please node" >
                <el-option label="ALL" value=""></el-option>
                <el-option
                        v-for="item in instanceFormData"
                        :key="item.id"
                        :label="item.hostname"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="20">
            <el-form-item :label="$t('message.common.remark')" prop="remark" class="ms">
              <el-input type="textarea" v-model="ruleForm.remark" placeholder="Please remark..."></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('message.ci.instances')" prop="miaoshu">
              <!-- 查询结果表格 -->
              <div  v-loading='dialogLoading'>
                <template>
                  <el-table
                          :data="ruleForm.tableData2"
                          border
                          style="width: 100%">
                    <!-- 动态标签 -->
                    <el-table-column prop="namespaceId" :label="$t('message.scm.namespace')" min-width="290">
                      <template slot-scope="scope">

                        <el-select v-model="scope.row.namespaceId"  placeholder="namespace" >
                          <el-option
                                  v-for="item in namespaces"
                                  :key="item"
                                  :label="item"
                                  :value="item">
                          </el-option>
                        </el-select>

                        <!-- <el-form-item :prop="'tableData2.' + scope.$index + '.filename'" :rules='rules.filename' >
													<el-input size="small" class="mm" v-model="scope.row.filename" placeholder="Please filename" ></el-input>
												</el-form-item> -->
                      </template>
                    </el-table-column>
                    <el-table-column prop="type" :label="$t('message.common.type')" min-width="130">
                      <template slot-scope="scope">
                        <el-radio v-model="scope.row.type" :label="1">yml(yaml)</el-radio>
                        <el-radio v-model="scope.row.type" :label="2">preperties</el-radio>
                      </template>
                    </el-table-column>

                    <el-table-column prop="content" :label="$t('message.scm.content')" min-width="140">
                      <template slot-scope="scope">
                        <el-form-item :prop="'tableData2.' + scope.$index + '.content'" :rules='rules.content' >
                          <el-input  v-model="scope.row.content" class="mm" type="textarea" @focus="inputcontent(scope.$index,scope.row.content)" placeholder="Please instance content" ></el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column :label="$t('message.common.operation')" min-width="140">
                      <template slot-scope="scope">
                        <el-row>
                          <el-button
                                  @click.native.prevent="deleteInstance(scope.$index, scope.row.id)"
                                  type="danger"
                          >
                            Delete
                          </el-button>
                          <!-- <el-button
														@click.native.prevent="submitInstance(scope.row)"
														type="text"
														size="mini"
														style="line-height: 20px;">
														保存
													</el-button> -->
                        </el-row>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </div>
              <el-button type="primary"  @click.native.prevent="addRow()"> + </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 插入表格 -->
        <!-- <el-form-item label="配置文本：" prop="content" class="mh">
					<el-input type="textarea" v-model="ruleForm.content" placeholder="请输入配置内容"></el-input>
				</el-form-item> -->
        <!-- <el-form-item label="文件类型：" prop="type" class="ms">
					<el-radio v-model="ruleForm.type" label="0">preperties</el-radio>
					<el-radio v-model="ruleForm.type" label="1">yml(yaml)</el-radio>
				</el-form-item> -->
        <!-- end -->

      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
            <el-button @click="dialogVisible = false;if(!isedit){instancelist=[]}">{{$t('message.common.cancel')}}</el-button>
          </span>
    </el-dialog>

    <!-- 编辑配置弹出窗口 -->
    <el-dialog
            title="编辑配置内容"
            :visible.sync="innerVisible"
            append-to-body custom-class="mytc">
      <template v-if="checkfalg">
        <img src="static/images/bg_icon/correct.png" class='logo' alt="" >
      </template>
      <template v-if="!checkfalg">
        <img src="static/images/bg_icon/error.png" class='logo' alt="" >
      </template>
      <el-input  v-model="insidecontent" type="textarea" @change="checkconf" autosize  placeholder="请输入配置内容" class="myinput" ></el-input>
      <!-- end -->
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="syncontent()" >{{$t('message.common.save')}}</el-button>
            <el-button @click="innerVisible = false">{{$t('message.common.cancel')}}</el-button>
          </span>
    </el-dialog>

    <!-- 弹出内容 -->
    <el-dialog
            :title="logtitle"
            :visible.sync="dialogDisable"
            width="80%"
            custom-class="tanchuang"
    >
      <el-radio-group v-model="propertiesid" @change="selectproperties()" >
        <el-radio-button  v-for="item in propertiesData"
                          :label="item.id" :key="item.id" >{{item.filename}}</el-radio-button>
      </el-radio-group>
      <el-input type="textarea" autosize v-model="content" :disabled="false"></el-input>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitflsh()">{{$t('message.common.refresh')}}</el-button>
          </span>
    </el-dialog>

  </div>
</template>
<script>
  import Configuration from './Configuration.js'

  export default Configuration
</script>
<style>

.number{
  font-weight: bold;color: #6cb33e;
}
.tanchuang .ms{
  width: 100%;
}
.tanchuang .mh{
  width: 100%;
  height: 20px;
}
.tanchuang .mm .el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 7px;
  line-height: 1.5;
  width: 130px;
  color: #1f2d3d;
  background-color: #fff;
  background-image: none;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
.tanchuang .el-textarea{
  width: 97%;
}
.myinput .el-textarea:focus {
  border-color: #719ECE;
  box-shadow: 0 0 10px #719ECE;
}
.logo {
  height: 25px;
  width: auto;
  margin-left: 0px;
  margin-top: 0px;
}

</style>
