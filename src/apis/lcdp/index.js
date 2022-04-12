import global from "../../common/global_variable";

export default [

    //gen database
    {
        name: 'databaseList',
        method: 'databaseList',
        path: '/gen/datasource/list',
        type: 'post',
        sysModule: global.lcdp
    },
    {
        name: 'saveDatabase',
        method: 'saveDatabase',
        path: '/gen/datasource/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.lcdp
    },
    {
        name: 'databaseDetail',
        method: 'databaseDetail',
        path: '/gen/datasource/detail',
        type: 'post',
        sysModule: global.lcdp
    },
    {
        name: 'delDatabase',
        method: 'delDatabase',
        path: '/gen/datasource/del',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'getDatabaseForSelect',
        method: 'getDatabaseForSelect',
        path: '/gen/datasource/loadDatasources',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'testConnectDb',
        method: 'testConnectDb',
        path: '/gen/datasource/testConnectDb',
        type: 'post',
        dataType: 'json',
        sysModule: global.lcdp
    },

    //gen config
    {
        name: 'genConfigList',
        method: 'genConfigList',
        path: '/gen/configure/list',
        type: 'post',
        sysModule: global.lcdp
    },
    {
        name: 'saveGenConfig',
        method: 'saveGenConfig',
        path: '/gen/configure/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.lcdp
    },
    {
        name: 'genConfigDetail',
        method: 'genConfigDetail',
        path: '/gen/configure/detail',
        type: 'post',
        sysModule: global.lcdp
    },
    {
        name: 'delGenConfig',
        method: 'delGenConfig',
        path: '/gen/configure/del',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'generate',
        method: 'generate',
        path: '/gen/configure/generate',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'findTables',
        method: 'findTables',
        path: '/gen/configure/findTables',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'loadGenColumns',
        method: 'loadGenColumns',
        path: '/gen/configure/loadGenColumns',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'setTableEnable',
        method: 'setTableEnable',
        path: '/gen/configure/setGenTableStatus',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'getAttrTypes',
        method: 'getAttrTypes',
        path: '/gen/configure/getAttrTypes',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'syncGenTableConfig',
        method: 'syncGenTableConfig',
        path: '/gen/configure/syncGenTableConfig',
        type: 'post',
        sysModule: global.lcdp
    },

    //gen/project
    {
        name: 'projectList',
        method: 'projectList',
        path: '/gen/project/list',
        type: 'post',
        sysModule: global.lcdp
    },
    {
        name: 'saveProject',
        method: 'saveProject',
        path: '/gen/project/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.lcdp
    },
    {
        name: 'projectDetail',
        method: 'projectDetail',
        path: '/gen/project/detail',
        type: 'post',
        sysModule: global.lcdp
    },
    {
        name: 'delProject',
        method: 'delProject',
        path: '/gen/project/del',
        type: 'post',
        sysModule: global.lcdp
    },
    {
        name: 'extraOptions',
        method: 'extraOptions',
        path: '/gen/project/extraOptions',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'getGenProviderSet',
        method: 'getGenProviderSet',
        path: '/gen/project/getGenProviderSet',
        type: 'post',
        sysModule: global.lcdp
    }, {
        name: 'tableExtraOptions',
        method: 'tableExtraOptions',
        path: '/gen/configure/tableExtraOptions',
        type: 'post',
        sysModule: global.lcdp
    },

]
