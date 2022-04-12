<template>
  <section class="console">
    <!-- //表单 -->


    <div class="log">
      <!--<div class="query">
        <div class="query-left">
          <div class="line"></div>
          Filter Result:<span class="number">{{total}}</span>
        </div>
      </div>-->
      <template>

          <div id="terminal"></div>
      </template>
    </div>

      <!-- 弹出内容 -->
      <el-dialog title="Log advanced filter conditions setup" :visible.sync="dialogVisible" width="30%" class="tanchuang">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <!-- 插入表格 -->
              <el-form-item :label="$t('message.srm.filter')" prop="miaoshu">
                  <!-- 查询结果表格 -->
                  <div style="float:left;">
                      <template>
                          <el-table :data="tableData1" :border="false">
                              <!-- 动态标签 -->
                              <el-table-column :label="$t('message.srm.include')">
                                  <template slot-scope="scope">
                                      <el-checkbox v-model="scope.row.enable" ></el-checkbox>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="value" :label="$t('message.share.value')" width="240">
                                  <template slot-scope="scope">
                                      <el-input size="small" v-model="scope.row.value" placeholder="Input keyword" ></el-input>
                                  </template>
                              </el-table-column>
                              <el-table-column  :label="$t('message.common.operation')" >
                                  <template slot-scope="scope">
                                      <el-button
                                              @click.native.prevent="deleteRow(scope.$index, tableData1)"
                                              type="text" size="small">{{$t('message.common.del')}}</el-button>
                                  </template>
                              </el-table-column>
                          </el-table>
                      </template>
                  </div>
                  <el-button type="primary"  @click.native.prevent="addRow()"> + </el-button>
              </el-form-item>
              <!-- end -->
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirm"> {{$t('message.common.save')}} </el-button>
        </span>
      </el-dialog>

      <el-dialog
              title="Log loading policy setup" :visible.sync="historylog" width="30%" class="tanchuang1">
          <el-form :inline="true" :model="formInline" >
              <!-- 插入表格 -->
              <el-form-item :label="$t('message.srm.policy')" prop="miaoshu">
                  <div style="float:left;">
                      <el-radio-group v-model="radio">
                          <el-radio-button :label="1" class="myradio">{{$t('message.srm.relativeTime')}}</el-radio-button>
                          <el-radio-button :label="2" class="myradio">{{$t('message.srm.customTime')}}</el-radio-button>
                      </el-radio-group>
                  </div>
                  <div v-show="radio==1" style="float:left;">
                      <el-radio-group v-model="radio1">
                          <el-radio :label="1">1 min</el-radio>
                          <el-radio :label="2">15 min</el-radio>
                          <el-radio :label="3">1 hour</el-radio>
                          <el-radio :label="4">4 hour</el-radio>
                      </el-radio-group>
                  </div>
                  <div v-show="radio==2"  style="float:left;">
                      <div>
                          <el-date-picker
                                  v-model="value1"
                                  type="date"
                                  placeholder="选择日期" style="padding:10px 0px">
                          </el-date-picker>
                      </div>
                      <el-time-picker
                              v-model="value2"
                              :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                              placeholder="任意时间点">
                      </el-time-picker>
                      <el-time-picker arrow-control v-model="value3"
                                      :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                      placeholder="任意时间点">
                      </el-time-picker>
                  </div>
                  <div v-show="radio==1"  style="float:left;color:rgb(119,122,126);line-height:25px;margin-top:20px;">
                      e.g. Selected 1 min, means loading the latest minute log, <br>note: there may be some delay.
                  </div>
                  <div v-show="radio==2"  style="float:left;color:rgb(119,122,126);line-height:25px;margin-top:20px;">
                      Desc: Load logs between absolute time intervals [startTime, endTime]<br>
                      This time range is the log collection time. It is not the actual log generation time and has a certain delay (approximate value). <br>
                      To filter the exact log time, use keyword and advanced to filter.
                  </div>
              </el-form-item>
              <!-- end -->
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submit">OK</el-button>
        </span>
      </el-dialog>


      <bottom-panel>
          <el-form :model="formInline" label-width="auto" class="clearfix searchbar">
              <el-form-item :label="$t('message.srm.level')" >
                  <el-tooltip class="item" effect="dark" content="Filter log level, upward compatibility." placement="bottom-start">
                      <el-select v-model="formInline.loglevle" class="testinput">
                          <el-option v-for="item in loglevle"
                                     :key="item.id" :label="item.value" :value="item.id">
                          </el-option>
                      </el-select>
                  </el-tooltip>
              </el-form-item>
              <el-form-item :label="$t('message.ci.cluster')" prop="group">
                  <el-select filterable v-model="formInline.index">
                      <el-option v-for="item in groupData"
                                 :key="item.id" :label="item.name" :value="item.name">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('message.srm.keyword')">
                  <el-input v-model="formInline.content" placeholder="e.g. addr=11111119"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-checkbox v-model="formInline.enable"></el-checkbox>

                  <p @click="screen" style="display: inline-block;font-weight:500;color:#1d90e6;cursor:pointer;">Advance</p>

                  <el-tooltip placement="top">
                      <div slot="content">Desc: Multi-conditional filter to support include and exclude relationships.<br/>Check to enable advanced.</div>
                      <i class="el-icon-warning" style="color:#e0e0e2;"></i>
                  </el-tooltip>
              </el-form-item>

              <el-form-item :label="$t('message.srm.flush')">
                  <el-input v-model="formInline.fq" placeholder="sec" style="width:50px;" @blur="checkfq"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="startThread()" >{{excute}}</el-button>
              </el-form-item>

              <div >
                  <el-button type="success" @click="tailLast()">Tail</el-button>

                  <el-button type="danger" @click="cleanConsole()" icon='delete2' style="margin-left: 4px">Clean</el-button>

                  <!-- 新增按钮 -->
                  <el-button type="primary" @click="historylog = true" style="margin-left: 4px">History</el-button>
              </div>
              <!-- end -->
          </el-form>
      </bottom-panel>

  </section>


</template>
<script>
  import Console from './Console.js'
  export default Console
</script>
<style>

.number{
  font-weight: bold;color: #6cb33e;margin-left:8px;
}

.myradio .el-radio-button__inner {
  font-size: 8px
}

</style>
