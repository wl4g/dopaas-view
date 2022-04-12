import global from '../../common/global_variable.js'

export default [
    //vcs
    {
        name: 'vcs列表',
        method: 'vcsList',
        path: '/vcs/list',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: '保存vcs',
        method: 'saveVcs',
        path: '/vcs/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.urm
    },
    {
        name: 'vcs详情',
        method: 'vcsDetail',
        path: '/vcs/detail',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: '删除vcs',
        method: 'delVcs',
        path: '/vcs/del',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: '所有vcs',
        method: 'vcsAll',
        path: '/vcs/all',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: 'vcsProjects',
        method: 'vcsProjects',
        path: '/vcs/vcsProjects',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: 'getGroups',
        method: 'getGroups',
        path: '/vcs/getGroups',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: 'getProjects',
        method: 'getProjects',
        path: '/vcs/getProjects',
        type: 'post',
        sysModule: global.urm
    },

    {
        name: 'getProjectById',
        method: 'getProjectById',
        path: '/vcs/getProjectById',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: 'getBranchs',
        method: 'getBranchs',
        path: '/vcs/getBranchs',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: 'getTags',
        method: 'getTags',
        path: '/vcs/getTags',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: 'createBranch',
        method: 'createBranch',
        path: '/vcs/createBranch',
        type: 'post',
        sysModule: global.urm
    },
    {
        name: 'createTag',
        method: 'createTag',
        path: '/vcs/createTag',
        type: 'post',
        sysModule: global.urm
    },


]
