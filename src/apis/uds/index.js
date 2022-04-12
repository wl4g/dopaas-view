import global from "../../common/global_variable";
//let baseUrl = global.getBaseUrl(global.umcBaseUrlKey,global.umcDefaultPath);

export default [

    //app
    {
        name: 'getApp',
        method: 'getApp',
        path: '/api/app/list',
        type: 'get',
        sysModule: global.uds
    },{
        name: 'deleteApp',
        method: 'deleteApp',
        path: '/api/app/delete',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'addApp',
        method: 'addApp',
        path: '/api/app/register',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'updateApp',
        method: 'updateApp',
        path: '/api/app/update',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'disableApp',
        method: 'disableApp',
        path: '/api/app/disable',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'enableApp',
        method: 'enableApp',
        path: '/api/app/enable',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'loadStatus',
        method: 'loadStatus',
        path: '/api/job/events/statusTraces',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'loadExecution',
        method: 'loadExecution',
        path: '/api/job/events/executions',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getJobConfig',
        method: 'getJobConfig',
        path: '/api/job/jobs',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getJobDetail',
        method: 'getJobDetail',
        path: '/api/job/jobs/detail',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'disableJob',
        method: 'disableJob',
        path: '/api/job/disable',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'enableJob',
        method: 'enableJob',
        path: '/api/job/enable',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'removeJob',
        method: 'removeJob',
        path: '/api/job/delDeregister',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'addJobConfig',
        method: 'addJobConfig',
        path: '/api/job/register',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'updateJobConfig',
        method: 'updateJobConfig',
        path: '/api/job/update',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getAppDetail',
        method: 'getAppDetail',
        path: '/api/app/detail',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getTasksResults',
        method: 'getTasksResults',
        path: '/api/job/statistics/tasks/results',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getTasksPeriod',
        method: 'getTasksPeriod',
        path: '/api/job/statistics/tasks/results/getTasksPeriod',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getTasksRunning',
        method: 'getTasksRunning',
        path: '/api/job/statistics/tasks/running',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getJobsExecutionType',
        method: 'getJobsExecutionType',
        path: '/api/job/statistics/jobs/executionType',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getJobsRunning',
        method: 'getJobsRunning',
        path: '/api/job/statistics/jobs/running',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getJobsRegister',
        method: 'getJobsRegister',
        path: '/api/job/statistics/jobs/register',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'findAllRunningTasks',
        method: 'findAllRunningTasks',
        path: '/api/job/tasks/running',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'findAllReadyTasks',
        method: 'findAllReadyTasks',
        path: '/api/job/tasks/ready',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'findAllFailoverTasks',
        method: 'findAllFailoverTasks',
        path: '/api/job/tasks/failover',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getRegCenter',
        method: 'getRegCenter',
        path: '/api/registry-center/load',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'deleteRegCenter',
        method: 'deleteRegCenter',
        path: '/api/registry-center/delete',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'postRegCenter',
        method: 'postRegCenter',
        path: '/api/registry-center/add',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'getRegCenterActivated',
        method: 'getRegCenterActivated',
        path: '/api/registry-center/activated',
        type: 'post',
        sysModule: global.uds
    },{
        name: 'postRegCenterConnect',
        method: 'postRegCenterConnect',
        path: '/api/registry-center/connect',
        type: 'post',
        sysModule: global.uds
    },





]
