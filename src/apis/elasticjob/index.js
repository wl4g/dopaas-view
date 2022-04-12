import global from "../../common/global_variable";
//let baseUrl = global.getBaseUrl(global.umcBaseUrlKey,global.umcDefaultPath);

export default [

    //   availableDriverClasses: (params = {}) => API.get(`/api/data-source/drivers`, params),
    {
        name: 'availableDriverClasses',
        method: 'availableDriverClasses',
        path: '/api/data-source/drivers',
        type: 'get',
        sysModule: global.uds
    },

    //   load: (params = {}) => API.get(`/api/data-source/load`, params),
    {
        name: 'load',
        method: 'load',
        path: '/api/data-source/load',
        type: 'get',
        sysModule: global.uds
    },

    //   delete: (params = {}) => API.delete(`/api/data-source`, params),
    {
        name: 'delete',
        method: 'delete',
        path: '/api/data-source/del',
        type: 'post',
        sysModule: global.uds
    },

    //   add: (params = {}) => API.post(`/api/data-source/add`, params),
    {
        name: 'add',
        method: 'add',
        path: '/api/data-source/add',
        type: 'post',
        dataType: 'json',
        sysModule: global.uds
    },

    //   getRegCenterActivated: (params = {}) => API.get(`/api/data-source/activated`, params),
    {
        name: 'getRegCenterActivated',
        method: 'getRegCenterActivated',
        path: '/api/data-source/activated',
        type: 'get',
        sysModule: global.uds
    },

    //   connect: (params = {}) => API.post(`/api/data-source/connect`, params),
    {
        name: 'connect',
        method: 'connect',
        path: '/api/data-source/connect',
        type: 'post',
        dataType: 'json',
        sysModule: global.uds
    },

    //   connectTest: (params = {}) => API.post(`/api/data-source/connectTest`, params)
    {
        name: 'connectTest',
        method: 'connectTest',
        path: '/api/data-source/connectTest',
        type: 'post',
        dataType: 'json',
        sysModule: global.uds
    },


    //   loadStatus: (params = {}) => API.post(`/api/event-trace/status`, params),
    {
        name: 'loadStatus',
        method: 'loadStatus',
        path: '/api/event-trace/status',
        type: 'post',
        dataType: 'json',
        sysModule: global.uds
    },

    //   getStatusJobNameSuggestions: (jobNamePrefix = '') => API.get(`/api/event-trace/status/jobNames/${jobNamePrefix}`)
    {
        name: 'getStatusJobNameSuggestions',
        method: 'getStatusJobNameSuggestions',
        path: '/api/event-trace/status/jobNames',
        type: 'get',
        sysModule: global.uds
    },

    //   loadExecution: (params = {}) => API.post(`/api/event-trace/execution`, params),
    {
        name: 'loadExecution',
        method: 'loadExecution',
        path: '/api/event-trace/execution',
        type: 'post',
        dataType: 'json',
        sysModule: global.uds
    },

    //   getExecutionJobNameSuggestions: (jobNamePrefix = '') => API.get(`/api/event-trace/execution/jobNames/${jobNamePrefix}`),
    {
        name: 'getExecutionJobNameSuggestions',
        method: 'getExecutionJobNameSuggestions',
        path: '/api/event-trace/execution/jobNames',
        type: 'get',
        sysModule: global.uds
    },

    //   getExecutionIpSuggestions: (ipPrefix = '') => API.get(`/api/event-trace/execution/ip/${ipPrefix}`)
    {
        name: 'getExecutionIpSuggestions',
        method: 'getExecutionIpSuggestions',
        path: '/api/event-trace/execution/ip',
        type: 'get',
        sysModule: global.uds
    },



    //   getAllJobsBriefInfo: (params = {}) => API.get(`/api/jobs/getAllJobsBriefInfo`, params),
    {
        name: 'getAllJobsBriefInfo',
        method: 'getAllJobsBriefInfo',
        path: '/api/jobs/getAllJobsBriefInfo',
        type: 'get',
        sysModule: global.uds
    },


    //   getJobsTotalCount: (params = {}) => API.get(`/api/jobs/count`, params),
    {
        name: 'getJobsTotalCount',
        method: 'getJobsTotalCount',
        path: '/api/jobs/count',
        type: 'get',
        sysModule: global.uds
    },

    //   triggerJob: (params = {}) => API.post('/api/jobs/' + params.jobName + '/trigger'),
    {
        name: 'triggerJob',
        method: 'triggerJob',
        path: '/api/jobs/trigger',
        type: 'post',
        sysModule: global.uds
    },

    //   disableJob: (params = {}) => API.post('/api/jobs/' + params.jobName + '/disable'),
    {
        name: 'disableJob',
        method: 'disableJob',
        path: '/api/jobs/disable',
        type: 'post',
        sysModule: global.uds
    },

    //   enableJob: (params = {}) => API.post('/api/jobs/' + params.jobName + '/enable'),
    {
        name: 'enableJob',
        method: 'enableJob',
        path: '/api/jobs/enable',
        type: 'post',
        sysModule: global.uds
    },

    //   shutdownJob: (params = {}) => API.post('/api/jobs/' + params.jobName + '/shutdown'),
    {
        name: 'shutdownJob',
        method: 'shutdownJob',
        path: '/api/jobs/shutdown',
        type: 'post',
        sysModule: global.uds
    },

    //   getShardingInfo: (params = {}) => API.get('/api/jobs/' + params.jobName + '/sharding'),
    {
        name: 'getShardingInfo',
        method: 'getShardingInfo',
        path: '/api/jobs/sharding',
        type: 'post',
        sysModule: global.uds
    },

    //   disableSharding: (params) => API.post('/api/jobs/' + params.jobName + '/sharding/' + params.item + '/disable'),
    {
        name: 'disableSharding',
        method: 'disableSharding',
        path: '/api/jobs/sharding/disable',
        type: 'post',
        sysModule: global.uds
    },

    //   enableSharding: (params) => API.post('/api/jobs/' + params.jobName + '/sharding/' + params.item + '/enable'),
    {
        name: 'enableSharding',
        method: 'enableSharding',
        path: '/api/jobs/sharding/enable',
        type: 'post',
        sysModule: global.uds
    },

    //   getJobConfig: (params = {}) => API.get('/api/jobs/config/' + params.jobName),
    {
        name: 'getJobConfig',
        method: 'getJobConfig',
        path: '/api/jobs/config/get',
        type: 'post',
        sysModule: global.uds
    },

    //   removeJob: (params = {}) => API.delete('/api/jobs/config/' + params.jobName),
    {
        name: 'removeJob',
        method: 'removeJob',
        path: '/api/jobs/config/del',
        type: 'post',
        sysModule: global.uds
    },

    //   updateJobConfig: (params = {}) => API.put(`/api/jobs/config`, params)
    {
        name: 'updateJobConfig',
        method: 'updateJobConfig',
        path: '/api/jobs/config/update',
        type: 'post',
        dataType: 'json',
        sysModule: global.uds
    },


    //   getAllServersBriefInfo: (params = {}) => API.get(`/api/servers/getAllServersBriefInfo`, params),
    {
        name: 'getAllServersBriefInfo',
        method: 'getAllServersBriefInfo',
        path: '/api/servers/getAllServersBriefInfo',
        type: 'get',
        sysModule: global.uds
    },

    //   getServersTotalCount: (params = {}) => API.get(`/api/servers/count`, params),
    {
        name: 'getServersTotalCount',
        method: 'getServersTotalCount',
        path: '/api/servers/count',
        type: 'get',
        sysModule: global.uds
    },

    //   disableServer: (params = {}) => API.post('/api/servers/' + params.serverIp + '/disable'),
    {
        name: 'disableServer',
        method: 'disableServer',
        path: '/api/servers/disable',
        type: 'post',
        sysModule: global.uds
    },

    //   enableServer: (params = {}) => API.post('/api/servers/' + params.serverIp + '/enable'),
    {
        name: 'enableServer',
        method: 'enableServer',
        path: '/api/servers/enable',
        type: 'post',
        sysModule: global.uds
    },

    //   shutdownServer: (params = {}) => API.post('/api/servers/' + params.serverIp + '/shutdown'),
    {
        name: 'shutdownServer',
        method: 'shutdownServer',
        path: '/api/servers/shutdown',
        type: 'post',
        sysModule: global.uds
    },

    //   removeServer: (params = {}) => API.delete('/api/servers/' + params.serverIp + ''),
    {
        name: 'removeServer',
        method: 'removeServer',
        path: '/api/servers/del',
        type: 'post',
        sysModule: global.uds
    },

    //   getJobs: (params = {}) => API.get('/api/servers/' + params.serverIp + '/jobs'),
    {
        name: 'getJobs',
        method: 'getJobs',
        path: '/api/servers/jobs/get',
        type: 'get',
        sysModule: global.uds
    },

    //   disableServerJob: (params) => API.post('/api/servers/' + params.serverIp + '/jobs/' + params.jobName + '/disable'),
    {
        name: 'disableServerJob',
        method: 'disableServerJob',
        path: '/api/servers/jobs/disable',
        type: 'post',
        sysModule: global.uds
    },

    //   enableServerJob: (params) => API.post('/api/servers/' + params.serverIp + '/jobs/' + params.jobName + '/enable'),
    {
        name: 'enableServerJob',
        method: 'enableServerJob',
        path: '/api/servers/jobs/enable',
        type: 'post',
        sysModule: global.uds
    },

    //   shutdownServerJob: (params) => API.post('/api/servers/' + params.serverIp + '/jobs/' + params.jobName + '/shutdown'),
    {
        name: 'shutdownServerJob',
        method: 'shutdownServerJob',
        path: '/api/servers/jobs/shutdown',
        type: 'post',
        sysModule: global.uds
    },

    //   removeServerJob: (params) => API.delete('/api/servers/' + params.serverIp + '/jobs/' + params.jobName + '')
    {
        name: 'removeServerJob',
        method: 'removeServerJob',
        path: '/api/servers/jobs/del',
        type: 'post',
        sysModule: global.uds
    },

    //   getRegCenter: (params = {}) => API.get(`/api/registry-center/load`, params),
    {
        name: 'getRegCenter',
        method: 'getRegCenter',
        path: '/api/registry-center/load',
        type: 'get',
        sysModule: global.uds
    },

    //   deleteRegCenter: (params = {}) => API.delete(`/api/registry-center`, params),
    {
        name: 'deleteRegCenter',
        method: 'deleteRegCenter',
        path: '/api/registry-center/del',
        type: 'post',
        sysModule: global.uds
    },

    //   postRegCenter: (params = {}) => API.post(`/api/registry-center/add`, params),
    {
        name: 'postRegCenter',
        method: 'postRegCenter',
        path: '/api/registry-center/add',
        type: 'post',
        dataType: 'json',
        sysModule: global.uds
    },

    //   getRegCenterActivated: (params = {}) => API.get(`/api/registry-center/activated`, params),
    {
        name: 'getRegCenterActivated',
        method: 'getRegCenterActivated',
        path: '/api/registry-center/activated',
        type: 'get',
        sysModule: global.uds
    },

    //   postRegCenterConnect: (params = {}) => API.post(`/api/registry-center/connect`, params)
    {
        name: 'postRegCenterConnect',
        method: 'postRegCenterConnect',
        path: '/api/registry-center/connect',
        type: 'post',
        sysModule: global.uds
    },









]
