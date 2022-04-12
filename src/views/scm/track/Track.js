
export default {
  name: 'Track',
  data () {
    return {
      formInline: {
        type: '',
        region: '',
        group: '',
        environment: '',
        instance: ''
      },

      pageNum: 1,
      pageSize: 10,

      options: [{
        value: 1,
        label: '成功'
      }, {
        value: 0,
        label: '未更改'
      }, {
        value: -1,
        label: '更新失败'
      }],
      tableData: [
      //   {
      //   data: '3',
      //   group:'sso',
      //   tag:'发布',
      //   time:'2018-10-10 10:10:10',
      // },{
      //   data: '3',
      //   group:'sso',
      //   tag:'回滚',
      //   time:'2018-10-10 10:10:10',
      // },{
      //   data: '3',
      //   group:'sso',
      //   tag:'发布',
      //   time:'2018-10-10 10:10:10',
      // }
    ],
      value1: '',
      value2: '',
      groupData: [],
      envirFormData: [],
      instanceFormData: [],
      loading: false,
      total: 0,
      detail: {},
      dialogLoading: true,
      dialogDisable: false,
      logtitle: ''

    }
  },
  mounted () {
    this.getGroup();
    this.getData();
  },
  methods: {
        rollback(row){
          this.$confirm('是否回滚版本?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let id = row.id;
            let remark = row.remark;
            let clusterId = row.clusterId;
            let envId = row.envId;
            let instanceId = row.instanceId;
            this.$$api_track_releaseback({
              data: {
                id: id,
                appClusterId : clusterId,
                instanceId : instanceId,
                envId: envId,
                remark: remark
              },
              fn: json => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getData();
              },
              errFn: () => {
                this.$message.error('request error');
              }
            })
          }).catch(() => {
            this.getData();
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        },
        onSubmit(){
          this.getData();
        },
        // 获取列表数据
        getData() {
          let clusterId = this.formInline.group;
          let envId = this.formInline.environment;
          let instanceId = this.formInline.instance;
          this.loading = true;

          this.$$api_track_releaselist({
            data: {
              appClusterId : clusterId,
              instanceId : instanceId,
              envId: envId,
              pageNum: this.pageNum,
              pageSize: this.pageSize,
            },
            fn: json => {
              this.loading = false;
                this.total = parseInt(json.data.page.total);
                this.tableData = json.data.list;
            },
            errFn: () => {
              this.loading = false;
              this.$message.error('request error');
            }
          })
        },
    getinstance(){
      this.instanceFormData=[];
      this.formInline.instance="";
      var clusterId = this.formInline.group;
      var environmentId = this.formInline.environment;
      if(environmentId==""||clusterId==""){
        return;
      }
      this.$$api_cmdb_instances({
        data: {
          clusterId: clusterId,
          envType: environmentId
        },
        fn: json => {
            this.instanceFormData = json.data.instances;
        }
      })
    },
    getGroup() {
      this.$$api_cmdb_clusters({
        fn: json => {
            this.groupData = json.data.clusters;
        },
      })
    },

    filterTag(value, row) {
      return row.tag === value;
    },
    currentChange(i) {
      this.pageNum = i;
      this.getData();
    },
    details(row){
      this.dialogLoading = true;
      this.dialogDisable = true;
      this.logtitle = 'History Detail';
      let instanceId = row.nodeId;
      let releaseId = row.historyId;
      this.$$api_track_reledetailselect({
        data:{
          instanceId: instanceId,
          releaseId: releaseId
        },
        fn: json => {
            this.dialogLoading = false;
            this.detail = json.data.detail;
        },
        errFn: () => {
          this.dialogLoading = false;
          this.$message.error('request error');
        }
      })
    },
  }
}
