import global from "../../common/global_variable";

import enterpriseApi from "./enterpriseApi"
import enterpriseDocument from "./enterpriseDocument"
import enterpriseGroup from "./enterpriseGroup"
import enterpriseProject from "./enterpriseProject"
import enterpriseProjectVersion from "./enterpriseProjectVersion"
import enterpriseTeam from "./enterpriseTeam"
import enterpriseApiModule from "./enterpriseApiModule"
import enterpriseTemplate from "./enterpriseTemplate"

export default [
    //doc file
    {
        name: 'docList',
        method: 'docList',
        path: '/doc/list',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'saveDoc',
        method: 'saveDoc',
        path: '/doc/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.udm
    }, {
        name: 'saveUpload',
        method: 'saveUpload',
        path: '/doc/saveUpload',
        type: 'post',
        dataType: 'json',
        sysModule: global.udm
    }, {
        name: 'docDetail',
        method: 'docDetail',
        path: '/doc/detail',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'delDoc',
        method: 'delDoc',
        path: '/doc/del',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'getHistoryByDocCode',
        method: 'getHistoryByDocCode',
        path: '/doc/getHistoryByDocCode',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'fileCompareWith',
        method: 'fileCompareWith',
        path: '/doc/compareWith',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'shareDoc',
        method: 'shareDoc',
        path: '/doc/shareDoc',
        type: 'post',
        sysModule: global.udm
    },

    {
        name: 'allLabel',
        method: 'allLabel',
        path: '/label/allLabel',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'labelList',
        method: 'labelList',
        path: '/label/list',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'saveLabel',
        method: 'saveLabel',
        path: '/label/save',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'labelDetail',
        method: 'labelDetail',
        path: '/label/detail',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'delLabel',
        method: 'delLabel',
        path: '/label/del',
        type: 'post',
        sysModule: global.udm
    },

    //share
    {
        name: 'shareList',
        method: 'shareList',
        path: '/share/list',
        type: 'post',
        sysModule: global.udm
    }, {
        name: 'cancelShare',
        method: 'cancelShare',
        path: '/share/cancelShare',
        type: 'post',
        sysModule: global.udm
    },


].concat(enterpriseApi)
    .concat(enterpriseGroup)
    .concat(enterpriseDocument)
    .concat(enterpriseProject)
    .concat(enterpriseProjectVersion)
    .concat(enterpriseTeam)
    .concat(enterpriseApiModule)
    .concat(enterpriseTemplate)
