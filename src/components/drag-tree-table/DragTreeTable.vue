<template>
  <el-table :data="formatData"  v-bind="$attrs" :row-key="rowKey">
    <el-table-column v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        {{ scope.$index }}
      </template>
    </el-table-column>

    <el-table-column v-for="(column, index) in columns" v-else :key="column.value" :label="column.text"
    :width="column.width" :show-overflow-tooltip="true">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>

        <span v-if="column.dictKey">
          {{dictutil.getDictLabelByTypeAndValue(column.dictKey, scope.row[column.value])}}
        </span>
        <span v-else-if="column.jump">
          <el-button type="text" @click="$router.push({path: column.jump.path, query: { [column.jump.query] : scope.row[column.jump.query]}})">{{ scope.row[column.value] }}</el-button>
        </span>
        <span v-else>
          {{ scope.row[column.value] }}
        </span>
      </template>
    </el-table-column>


    <!--OPTION BUTTON-->
    <el-table-column v-if="option_btns && option_btns.length>0" label="操作" :width="option_btns_width">
      <template slot-scope="scope">
        <el-button v-for="(item,i) in option_btns" :type="item.type?item.type:'text'" :icon="item.icon?item.icon:''"
                   @click="item.click(scope.row)">
          {{item.text}}
        </el-button>
      </template>
    </el-table-column>

  </el-table>
</template>
<script>

import treeToArray from './DragTreeTable'
export default {
  name: 'drag-tree-table',
  data () {
    return {
      tableHeight : 450,
      btn_info: this.BtnInfo, // 按钮信息
      allData : []
    }
  },
  props: {
    rowKey:{
      type: String,
      required: true
    },
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },

    option_btns: {
      type: Array,
      default () {
        return [];
      }
    },
    option_btns_width:{
      type: Number,
      default () {
        return 150;
      }
    }

  },
  computed: {
    // 格式化数据源
    formatData: function() {
      return this.data;
    }
  },
  methods: {
    showRow: function(row) {
      //const show = (row.parent ? (row.parent._expanded && row.parent._show) : true)
      const show = true;
      row._show = show;
      return show ? 'animation:treeTableShow 0.5s;-webkit-animation:treeTableShow 0.5s;' : 'display:none;'
    },
    // 图标显示
    iconShow(index, record) {
      return (index === 0 && record.children && record.children.length > 0)
    },
     /**
     * 点击按钮事件
     * @param opts  组装的返回参数
     * @param.attr  opts.type   string      按钮类型，内置四个(添加，修改，删除)
     * @param.attr  opts.index  number      当点击列表中的按钮时，此值为当前行的索引
     * @param.attr  opts.data   object      当点击列表中的按钮时，此值为当前行数据
     * @param.attr  opts.list   array       当点击列别中的按钮时，此值为当前列表数据
     */
    onBtnEvent (opts) {
      switch (opts.type) {
        case 'Add':
          this.$emit('onClickBtnAdd', opts)
          break
        case 'Update':
          this.$emit('onClickBtnUpdate', opts)
          break
        case 'Delete':
          this.$emit('onClickBtnDelete', opts)
          break
        default:
          this.$emit('onClickBtn', opts)
      }
    },
    /**
     * 自定义按钮事件
     * @param opts
     */
    onCustomBtnEvent (opts) {
      if (opts.btn.fn) {
        if(opts.btn.callBack){
          this.$emit(opts.btn.callBack.funName, Object.assign(opts, opts.btn.callBack.params))
        }else{
          opts.btn.fn(opts)
        }
      } else {
        this.$emit('onClickBtn', opts)
      }
    },
  },
  mounted() {
    this.tableHeight = this.$$lib_$(window).height() * 0.72
  }
}
</script>

<style scoped lang='less'>

  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  @color-blue: #2196F3;
  @space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: @space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: @color-blue;
    margin-left: -@space-width;
  }
</style>
