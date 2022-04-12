import global from '../../common/global_variable.js'

export default [

    //gateway
    {
        name: 'gateway列表',
        method: 'gatewayList',
        path: '/gateway/list',
        type: 'post',
        sysModule: global.gw
    },
    {
        name: '保存gateway',
        method: 'saveGateway',
        path: '/gateway/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.gw
    },
    {
        name: 'gateway详情',
        method: 'gatewayDetail',
        path: '/gateway/detail',
        type: 'post',
        sysModule: global.gw
    },
    {
        name: '删除gateway',
        method: 'delGateway',
        path: '/gateway/del',
        type: 'post',
        sysModule: global.gw
    },

    //upstream
    {
        name: 'upstream列表',
        method: 'upstreamList',
        path: '/upstream/list',
        type: 'post',
        sysModule: global.gw
    },
    {
        name: '保存upstream',
        method: 'saveUpstream',
        path: '/upstream/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.gw
    },
    {
        name: 'upstream详情',
        method: 'upstreamDetail',
        path: '/upstream/detail',
        type: 'post',
        sysModule: global.gw
    },
    {
        name: '删除upstream',
        method: 'delUpstream',
        path: '/upstream/del',
        type: 'post',
        sysModule: global.gw
    }, {
        name: 'getUpstreamsForSelect',
        method: 'getUpstreamsForSelect',
        path: '/upstream/getForSelect',
        type: 'post',
        sysModule: global.gw
    },


    //upstreamGroup
    {
        name: 'upstreamGroup列表',
        method: 'upstreamGroupList',
        path: '/upstreamGroup/list',
        type: 'post',
        sysModule: global.gw
    },
    {
        name: '保存upstreamGroup',
        method: 'saveUpstreamGroup',
        path: '/upstreamGroup/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.gw
    },
    {
        name: 'upstreamGroup详情',
        method: 'upstreamGroupDetail',
        path: '/upstreamGroup/detail',
        type: 'post',
        sysModule: global.gw
    },
    {
        name: '删除upstreamGroup',
        method: 'delUpstreamGroup',
        path: '/upstreamGroup/del',
        type: 'post',
        sysModule: global.gw
    },


]
