import global from '../../common/global_variable.js'

export default [

    //pipeline
    {
        name: '任务列表',
        method: 'pipelineList',
        path: '/pipe/list',
        type: 'post',
        sysModule: global.uci
    }, {
        name: '任务列表',
        method: 'getPipeStepBuilding',
        path: '/pipe/getPipeStepBuilding',
        type: 'post',
        sysModule: global.uci
    }, {
        name: '保存任务',
        method: 'savePipeline',
        path: '/pipe/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.uci
    },
    {
        name: '任务详情',
        method: 'pipelineDetail',
        path: '/pipe/detail',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '删除任务',
        method: 'delPipeline',
        path: '/pipe/del',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '创建任务',
        method: 'runPipeline',
        path: '/pipe/create',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '获取pipelines给下拉框使用',
        method: 'getPipelineForSelect',
        path: '/pipe/getForSelect',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '根据appClusterId获取任务',
        method: 'getPipesByAppClusterId',
        path: '/pipe/getListByAppClusterId',
        type: 'post',
        sysModule: global.uci
    },

    //task
    {
        name: '任务列表',
        method: 'taskList',
        path: '/task/list',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '保存任务',
        method: 'saveTask',
        path: '/task/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.uci
    },
    {
        name: '任务详情',
        method: 'taskDetail',
        path: '/task/detail',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '删除任务',
        method: 'delTask',
        path: '/task/del',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '创建任务',
        method: 'runTask',
        path: '/task/create',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '获取依赖',
        method: 'getTaskBuildCommands',
        path: '/task/getDependencys',
        type: 'post',
        sysModule: global.uci
    },


    //taskhis
    {
        name: '任务列表',
        method: 'pipeHisList',
        path: '/pipeHis/list',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '任务详情',
        method: 'pipeHisDetail',
        path: '/pipeHis/detail',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '回滚',
        method: 'rollbackPipeHis',
        path: '/pipeHis/rollback',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '获取日志',
        method: 'pipeHisReadLog',
        path: '/pipeHis/readLog',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '获取Detail日志',
        method: 'pipeHisReadDetailLog',
        path: '/pipeHis/readDetailLog',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '停止任务',
        method: 'stopTask',
        path: '/pipeHis/stopTask',
        type: 'post',
        sysModule: global.uci
    },


    //project
    {
        name: '项目列表',
        method: 'projectList',
        path: '/project/list',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '保存项目',
        method: 'saveProject',
        path: '/project/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.uci
    },
    {
        name: '项目详情',
        method: 'projectDetail',
        path: '/project/detail',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '删除项目',
        method: 'delProject',
        path: '/project/del',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '所有项目',
        method: 'getProjectBySelect',
        path: '/project/getBySelect',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '解锁项目',
        method: 'unlock',
        path: '/project/unlock',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '获取分支列表',
        method: 'getBranchs',
        path: '/project/getBranchs',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '获取分支列表',
        method: 'getProjectByAppClusterId',
        path: '/project/getByAppClusterId',
        type: 'post',
        sysModule: global.uci
    },

    //trigger
    {
        name: '触发器列表',
        method: 'triggerList',
        path: '/trigger/list',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '保存触发器',
        method: 'saveTrigger',
        path: '/trigger/save',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '触发器详情',
        method: 'triggerDetail',
        path: '/trigger/detail',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '删除触发器',
        method: 'delTrigger',
        path: '/trigger/del',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '校验cron',
        method: 'checkCron',
        path: '/trigger/cronNextExecTime',
        type: 'post',
        sysModule: global.uci
    },

    //analysis
    {
        name: 'analysis列表',
        method: 'analysisList',
        path: '/analysis/list',
        type: 'post',
        sysModule: global.uci
    },

    //pcm
    {
        name: 'pm获取用户列表',
        method: 'getUsers',
        path: '/pcm/getUsers',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: 'pm获取项目列表',
        method: 'getPcmProjects',
        path: '/pcm/getProjects',
        type: 'post',
        sysModule: global.uci
    }, {
        name: 'pm获取项目列表',
        method: 'getProjectsByPcmId',
        path: '/pcm/getProjectsByPcmId',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: 'pm获取问题列表',
        method: 'getIssues',
        path: '/pcm/getIssues',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: 'pcm列表',
        method: 'pcmList',
        path: '/pcm/list',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '保存pcm',
        method: 'savePcm',
        path: '/pcm/save',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: 'pcm详情',
        method: 'pcmDetail',
        path: '/pcm/detail',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '删除pcm',
        method: 'delPcm',
        path: '/pcm/del',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '所有pcm',
        method: 'pcmAll',
        path: '/pcm/all',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: 'getPcmStatuses',
        method: 'getPcmStatuses',
        path: '/pcm/getStatuses',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: 'getPcmTrackers',
        method: 'getPcmTrackers',
        path: '/pcm/getTrackers',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: 'getPcmPriorities',
        method: 'getPcmPriorities',
        path: '/pcm/getPriorities',
        type: 'post',
        sysModule: global.uci
    },


    //orchestration
    {
        name: 'orchestration列表',
        method: 'orchestrationList',
        path: '/orchestration/list',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '保存orchestration',
        method: 'saveOrchestration',
        path: '/orchestration/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.uci
    },
    {
        name: 'orchestration详情',
        method: 'orchestrationDetail',
        path: '/orchestration/detail',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '删除orchestration',
        method: 'delOrchestration',
        path: '/orchestration/del',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '运行orchestration',
        method: 'runOrchestration',
        path: '/orchestration/run',
        type: 'post',
        sysModule: global.uci
    },

    //clusterExtension
    {
        name: 'clusterExtensionList列表',
        method: 'clusterExtensionList',
        path: '/pipe/clusterExtensionList',
        type: 'post',
        sysModule: global.uci
    },
    {
        name: '保存clusterExtension',
        method: 'saveClusterExtension',
        path: '/pipe/saveClusterExtension',
        type: 'post',
        sysModule: global.uci
    },

    //orchestrationHistory
    {
        name: 'orchestrationHistoryList',
        method: 'orchestrationHistoryList',
        path: '/orchestrationHistory/list',
        type: 'post',
        sysModule: global.uci
    },


]
