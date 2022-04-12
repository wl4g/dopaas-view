import global from "../../common/global_variable";

export default [
    //bucket
    {
        name: 'listBuckets',
        method: 'listBuckets',
        path: '/webservice/listBuckets',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'createBucket',
        method: 'createBucket',
        path: '/webservice/createBucket',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'deleteBucket',
        method: 'deleteBucket',
        path: '/webservice/deleteBucket',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'getBucketIndex',
        method: 'getBucketIndex',
        path: '/webservice/getBucketIndex',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'getBucketAcl',
        method: 'getBucketAcl',
        path: '/webservice/getBucketAcl',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'setBucketAcl',
        method: 'setBucketAcl',
        path: '/webservice/setBucketAcl',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'resetBucketAcl',
        method: 'resetBucketAcl',
        path: '/webservice/resetBucketAcl',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'getACLs',
        method: 'getACLs',
        path: '/webservice/getACLs',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'getCossProviders',
        method: 'getCossProviders',
        path: '/webservice/getCossProviders',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'listBucketsWithProvider',
        method: 'listBucketsWithProvider',
        path: '/webservice/listBucketsWithProvider',
        type: 'post',
        sysModule: global.uos
    },


    //objects
    {
        name: 'listObjects',
        method: 'listObjects',
        path: '/webservice/listObjects',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'deleteObject',
        method: 'deleteObject',
        path: '/webservice/deleteObject',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'getObjectAcl',
        method: 'getObjectAcl',
        path: '/webservice/getObjectAcl',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'setObjectAcl',
        method: 'setObjectAcl',
        path: '/webservice/setObjectAcl',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'getObject',
        method: 'getObject',
        path: '/webservice/getObject',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'createDir',
        method: 'createDir',
        path: '/webservice/createDir',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'putObjectMetaData',
        method: 'putObjectMetaData',
        path: '/webservice/putObjectMetaData',
        type: 'post',
        dataType: 'json',
        sysModule: global.uos
    }, {
        name: 'copyObject',
        method: 'copyObject',
        path: '/webservice/copyObject',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'moveObject',
        method: 'moveObject',
        path: '/webservice/moveObject',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'shareObject',
        method: 'shareObject',
        path: '/webservice/shareObject',
        type: 'post',
        sysModule: global.uos
    }, {
        name: 'selectObjectContent',
        method: 'selectObjectContent',
        path: '/webservice/selectObjectContent',
        type: 'post',
        sysModule: global.uos
    },


]
