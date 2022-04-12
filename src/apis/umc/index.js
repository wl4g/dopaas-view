import global from "../../common/global_variable";

//let baseUrl = global.getBaseUrl(global.umcBaseUrlKey,global.umcDefaultPath);

export default [

    //template
    {
        name: '模版列表',
        method: 'templatList',
        path: '/template/list',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '保存模板',
        method: 'saveTemplat',
        path: '/template/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.umc
    },
    {
        name: '模版详情',
        method: 'templatDetail',
        path: '/template/detail',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '删除模板',
        method: 'delTemplat',
        path: '/template/del',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '根据类别获取列表',
        method: 'getTemplateByClassify',
        path: '/template/getByClassify',
        type: 'post',
        sysModule: global.umc
    },


    //record
    {
        name: '记录列表',
        method: 'recordList',
        path: '/record/list',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '记录详情',
        method: 'recordDetail',
        path: '/record/detail',
        type: 'post',
        sysModule: global.umc
    },


    //metric
    {
        name: '模版列表',
        method: 'metricList',
        path: '/metric/list',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '保存模板',
        method: 'saveMetric',
        path: '/metric/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.umc
    },
    {
        name: '模版详情',
        method: 'metricDetail',
        path: '/metric/detail',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '删除模板',
        method: 'delMetric',
        path: '/metric/del',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '模版列表',
        method: 'getMetricByClassify',
        path: '/metric/getByClassify',
        type: 'post',
        sysModule: global.umc
    },

    {
        name: '记录列表',
        method: 'notificationList',
        path: '/notification/list',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '记录详情',
        method: 'notificationDetail',
        path: '/notification/detail',
        type: 'post',
        sysModule: global.umc
    },

    //config
    {
        name: '模版列表',
        method: 'configList',
        path: '/config/list',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '保存模板',
        method: 'saveConfig',
        path: '/config/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.umc
    },
    {
        name: '模版详情',
        method: 'configDetail',
        path: '/config/detail',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '删除模板',
        method: 'delConfig',
        path: '/config/del',
        type: 'post',
        sysModule: global.umc
    },

    //datasource
    {
        name: '列表',
        method: 'dataSourceList',
        path: '/datasource/list',
        type: 'post',
        sysModule: global.umc
    }, {
        name: '保存',
        method: 'saveDataSource',
        path: '/datasource/save',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '详情',
        method: 'dataSourceDetail',
        path: '/datasource/detail',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '删除',
        method: 'delDataSource',
        path: '/datasource/del',
        type: 'post',
        sysModule: global.umc
    }, {
        name: '列表',
        method: 'dataSourceProvides',
        path: '/datasource/dataSourceProvides',
        type: 'post',
        sysModule: global.umc
    }, {
        name: '列表',
        method: 'testConnect',
        path: '/datasource/testConnect',
        type: 'post',
        sysModule: global.umc
    }, {
        name: '列表',
        method: 'dataSources',
        path: '/datasource/dataSources',
        type: 'post',
        sysModule: global.umc
    },

    //engine
    {
        name: '列表',
        method: 'engineList',
        path: '/engine/list',
        type: 'post',
        sysModule: global.umc
    }, {
        name: '保存',
        method: 'saveEngine',
        path: '/engine/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.umc
    },
    {
        name: '详情',
        method: 'engineDetail',
        path: '/engine/detail',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '删除',
        method: 'delEngine',
        path: '/engine/del',
        type: 'post',
        sysModule: global.umc
    },
    {
        name: '校验cron',
        method: 'checkCron',
        path: '/engine/cronNextExecTime',
        type: 'post',
        sysModule: global.umc
    },

    //alarmEvent
    {
        name: '列表',
        method: 'eventList',
        path: '/event/list',
        type: 'post',
        sysModule: global.umc
    },

    //
    {
        name: '列表',
        method: 'historyList',
        path: '/history/list',
        type: 'post',
        sysModule: global.umc
    },


]
