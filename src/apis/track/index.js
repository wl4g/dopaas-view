import global from "../../common/global_variable";

//let baseUrl = global.getBaseUrl(global.scmBaseUrlKey,global.scmDefaultPath);

export default [
    {
        name: '修改版本',
        method: 'update',
        path: '/configGuration/update',
        type: 'post',
        sysModule: global.scm
    },
    {
        name: '修改配置',
        method: 'updateguration',
        path: '/configGuration/updateGuration',
        type: 'post',
        sysModule: global.scm
    },
    {
        name: '删除配置项',
        method: 'deleteVersiondetail',
        path: '/configGuration/deleteVersionDetail',
        type: 'post',
        sysModule: global.scm
    },
    {
        name: '查询版本',
        method: 'select',
        path: '/configGuration/select',
        type: 'post',
        sysModule: global.scm
    },
    {
        name: '添加版本',
        method: 'configset',
        path: '/configGuration/config-set.json',
        type: 'post',
        dataType: 'json',
        sysModule: global.scm
    },
    {
        name: '获取版本列表',
        method: 'lists',
        path: '/configGuration/config-list.json',
        type: 'post',
        sysModule: global.scm
    },
    {
        name: '获取轨迹列表',
        method: 'releaselist',
        path: '/history/release-list.json',
        type: 'post',
        sysModule: global.scm
    },
    {
        name: '删除版本',
        method: 'versiondelete',
        path: '/history/version_delete',
        type: 'post',
        dataType: 'json',
        sysModule: global.scm
    },
    {
        name: '回滚版本',
        method: 'releaseback',
        path: '/history/release_rollback',
        type: 'post',
        sysModule: global.scm
    },
    {
        name: '查询详情',
        method: 'reledetailselect',
        path: '/history/reledetail-select.json',
        type: 'post',
        sysModule: global.scm
    }
]
