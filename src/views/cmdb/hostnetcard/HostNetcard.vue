<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item :label="$t('message.common.name')">
                <el-input clearable v-model="searchParams.name" placeholder="e.g. localhost" style="width:165px"></el-input>
            </el-form-item>
            <el-form-item label="主机">
                <el-select clearable v-model="searchParams.hostId" style="width: 100%">
                    <el-option
                            v-for="item in hosts"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="loading">{{$t('message.common.search')}}</el-button>
            </el-form-item>

            <el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >+ Add</el-button>
            <!--<el-button type="primary" style='float:right;margin-right:20px' @click="back()" >back</el-button>-->
        </el-form>

        <!--================================table================================-->
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
                <el-table :data="tableData" :border="false" style="width:100%">
                    <el-table-column :label="$t('message.common.selectAll')" type="selection"></el-table-column>
                    <!--<el-table-column width="100" prop="id" label="ID"></el-table-column>-->
                    <el-table-column prop="name" :label="$t('message.common.name')"></el-table-column>
                    <el-table-column prop="vpnTunnelType" label="vpn类型">
                        <template slot-scope="scope">
                            <el-tag :type="dictutil.getDictThemesByTypeAndValue('erm_vpn_tunnel_type',scope.row.vpnTunnelType)">{{dictutil.getDictLabelByTypeAndValue('erm_vpn_tunnel_type',scope.row.vpnTunnelType)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ipv4" label="ipv4"></el-table-column>
                    <el-table-column prop="ipv6" label="ipv6"></el-table-column>
                    <el-table-column prop="hwaddr" label="硬件Mac地址"></el-table-column>
                    <el-table-column prop="netmask" label="子网掩码"></el-table-column>
                    <el-table-column prop="broadcast" label="广播地址"></el-table-column>
                    <el-table-column prop="getway" label="网关地址"></el-table-column>

                    <el-table-column :label="$t('message.common.operation')" min-width="120">
                        <template slot-scope="scope">
                            <el-button v-if="permitutil.hasPermit('cmdb:netcard:edit')" type="info" icon='edit' @click="editData(scope.row)">{{$t('message.common.edit')}}</el-button>
                            <el-button type="danger" icon='delete'  @click="delData(scope.row)">{{$t('message.common.del')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="pageNum" @current-change='currentChange'></el-pagination>

        <!--================================save dialog================================-->
        <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible"  v-loading='dialogLoading'>
            <el-form label-width="80px" size="mini" :model="saveForm" ref="saveForm" class="demo-form-inline" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('message.common.name')" prop="name">
                            <el-input v-model="saveForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                  <el-col :span="12">
                        <el-form-item label="主机" prop="hostId">
                          <el-select clearable v-model="saveForm.hostId" style="width: 100%">
                            <el-option
                                v-for="item in hosts"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="ipv4" prop="ipv4">
                            <el-input v-model="saveForm.ipv4"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="ipv6" prop="ipv6">
                            <el-input v-model="saveForm.ipv6"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="Mac地址" prop="hwaddr">
                            <el-input v-model="saveForm.hwaddr"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="子网掩码" prop="netmask">
                            <el-input v-model="saveForm.netmask"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="广播地址" prop="broadcast">
                            <el-input v-model="saveForm.broadcast"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="网关地址" prop="getway">
                            <el-input v-model="saveForm.getway"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="vpn类型" prop="vpnTunnelType">
                            <el-select v-model="saveForm.vpnTunnelType" style="width: 100%">
                                <el-option
                                        v-for="item in dictutil.getDictListByType('erm_vpn_tunnel_type')"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveForm.vpnTunnelType === '2'">
                        <el-form-item label="Opennpn" prop="openvpnTunnelId">
                            <el-select v-model="saveForm.openvpnTunnelId" style="width: 100%">
                                <el-option
                                        v-for="item in openvpns"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="saveForm.vpnTunnelType === '3'">
                        <el-form-item label="Pptp" prop="openvpnTunnelId">
                            <el-select v-model="saveForm.openvpnTunnelId" style="width: 100%">
                                <el-option
                                        v-for="item in pptps"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <organization-selector :inputData="{organizationCode: saveForm.organizationCode}" @onChangeOrganization="opt => {if(opt){saveForm.organizationCode = opt}}"></organization-selector>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveData()" :loading="dialogLoading">{{$t('message.common.save')}}</el-button>
                <el-button @click="dialogVisible = false;">{{$t('message.common.cancel')}}</el-button>
            </span>
        </el-dialog>
    </section>
</template>


<script>
    import HostNetcard from './HostNetcard.js'

    export default HostNetcard
</script>

<style scoped>

</style>

