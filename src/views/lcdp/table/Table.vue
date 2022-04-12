<template>
    <section id="configuration" class="configuration">
        <el-form :inline="true" :model="searchParams" class="searchbar" @keyup.enter.native="onSubmit()">
            <el-form-item label="表名">
                <el-input v-model="searchParams.tableName" placeholder="e.g. localhost" style="width:165px"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="searchParams.status"  style="width: 100%">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                            v-for="item in dictutil.getDictListByType('common_enable_status')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <input hidden></input>
            <el-form-item>
                <el-button @click="onSubmit" type="success" :loading="tmetadataLoading">{{$t('message.common.search')}}</el-button>
            </el-form-item>

            <el-button type="primary" style='float:right;margin-right:20px' @click="addData()" >{{$t('message.common.add')}} GenTable</el-button>
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
                    <!-- <el-table-column width="100" prop="id" label="ID"></el-table-column> -->
                    <el-table-column prop="tableName" label="表名">
                        <template slot-scope="scope">
                            <a style="cursor:pointer" @click="openTableEdit(scope.row)">
                                {{scope.row.tableName}}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="entityName" label="映射实体类/结构"></el-table-column>
                    <el-table-column prop="functionAuthor" label="作者信息" :show-overflow-tooltip="true" min-width="50"></el-table-column>
                    <el-table-column prop="functionNameSimple" label="功能名" :show-overflow-tooltip="true" min-width="65">
                        <template slot="header" slot-scope="scope">
                            <span>功能简称</span>
                            <el-tooltip class="item" effect="dark" content="如用作菜单名称" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="functionName" label="功能信息" :show-overflow-tooltip="true">
                        <template slot="header" slot-scope="scope">
                            <span>功能信息</span>
                            <el-tooltip class="item" effect="dark" content="源码对应的功能信息，如, 作为源文件的注释" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="moduleName" label="模块名" :show-overflow-tooltip="true" min-width="55">
                        <template slot="header" slot-scope="scope">
                            <span>模块名</span>
                            <el-tooltip class="item" effect="dark" content="生成的源码所属模块名称" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="subModuleName" label="子模块名" :show-overflow-tooltip="true" min-width="55">
                        <template slot="header" slot-scope="scope">
                            <span>子模块名</span>
                            <el-tooltip class="item" effect="dark" content="生成的源码所属子模块名称(可选值)" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="humanUpdateDate" label="更新时间" min-width="50"></el-table-column>
                    <el-table-column label="启用" min-width="35">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status" :active-value="'1'" :inactive-value="'0'" @change="setGenTableStatus(scope.row)"/>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.common.operation')" min-width="80">
                        <template slot-scope="scope">
                            <el-button v-if="permitutil.hasPermit('udc:table:edit')"
                                type="text"
                                icon="el-icon-edit"
                                @click="editData(scope.row)"
                                :title="$t('message.common.edit')"
                            ></el-button>
                            <el-button
                                type="text"
                                icon="el-icon-delete"
                                @click="delData(scope.row)"
                                :title="$t('message.common.del')"
                            ></el-button>
                            <el-dropdown @command="handleCommand" trigger="click">
                              <span class="el-dropdown-link">
                                  <el-button type="text">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                              </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="{row: scope.row, force: false}">同步</el-dropdown-item>
                                    <el-dropdown-item :command="{row: scope.row, force: true}">强制同步</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination background layout="prev, pager, next" :total="total" @current-change='currentChange'></el-pagination>
    </section>
</template>

<script>
    import Table from './Table.js'
    export default Table
</script>

<style scoped>

</style>

