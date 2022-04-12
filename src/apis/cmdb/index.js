import global from "../../common/global_variable";

export default [
    //host
    {
        name: 'allHost',
        method: 'allHost',
        path: '/host/allHost',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'hostList',
        method: 'hostList',
        path: '/host/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveHost',
        method: 'saveHost',
        path: '/host/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'hostDetail',
        method: 'hostDetail',
        path: '/host/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delHost',
        method: 'delHost',
        path: '/host/del',
        type: 'post',
        sysModule: global.cmdb
    }, {
        name: 'createAndDownloadTemplate',
        method: 'createAndDownloadTemplate',
        path: '/host/createAndDownloadTemplate',
        type: 'get',
        sysModule: global.cmdb
    },


    //cluster
    {
        name: '集群列表',
        method: 'clusterList',
        path: '/cluster/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: '保存集群',
        method: 'saveCluster',
        path: '/cluster/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: '逻辑删除集群',
        method: 'delCluster',
        path: '/cluster/del',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: '集群详情',
        method: 'clusterDetail',
        path: '/cluster/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: '所有集群',
        method: 'clusters',
        path: '/cluster/clusters',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: '实例列表',
        method: 'instances',
        path: '/cluster/instances',
        type: 'post',
        sysModule: global.cmdb
    },


    {
        name: '获取控制台日志',
        method: 'getlog',
        path: '/console/consoleLog',
        type: 'post',
        dataType: 'json',
        async: false,
        sysModule: global.cmdb
    },


    //host netcard
    {
        name: 'netcardList',
        method: 'netcardList',
        path: '/netcard/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveNetcard',
        method: 'saveNetcard',
        path: '/netcard/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'netcardDetail',
        method: 'netcardDetail',
        path: '/netcard/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delNetcard',
        method: 'delNetcard',
        path: '/netcard/del',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'getHostTunnel',
        method: 'getHostTunnel',
        path: '/netcard/getHostTunnel',
        type: 'post',
        sysModule: global.cmdb
    },

    //idc
    {
        name: 'idcList',
        method: 'idcList',
        path: '/idc/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveIdc',
        method: 'saveIdc',
        path: '/idc/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'idcDetail',
        method: 'idcDetail',
        path: '/idc/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delIdc',
        method: 'delIdc',
        path: '/idc/del',
        type: 'post',
        sysModule: global.cmdb
    }, {
        name: 'getIdcForSelect',
        method: 'getIdcForSelect',
        path: '/idc/getForSelect',
        type: 'post',
        sysModule: global.cmdb
    },

    //ssh
    {
        name: 'sshList',
        method: 'sshList',
        path: '/ssh/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveSsh',
        method: 'saveSsh',
        path: '/ssh/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'sshDetail',
        method: 'sshDetail',
        path: '/ssh/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delSsh',
        method: 'delSsh',
        path: '/ssh/del',
        type: 'post',
        sysModule: global.cmdb
    }, {
        name: 'getSshForSelect',
        method: 'getSshForSelect',
        path: '/ssh/getForSelect',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: '连接测试',
        method: 'connectTest',
        path: '/ssh/connectTest',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: '生成sshkey',
        method: 'generateSshKeyPair',
        path: '/ssh/generateSshKeyPair',
        type: 'post',
        sysModule: global.cmdb
    },

    //docker cluster
    {
        name: 'dockerClusterList',
        method: 'dockerClusterList',
        path: '/dockerCluster/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveDockerCluster',
        method: 'saveDockerCluster',
        path: '/dockerCluster/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'dockerClusterDetail',
        method: 'dockerClusterDetail',
        path: '/dockerCluster/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delDockerCluster',
        method: 'delDockerCluster',
        path: '/dockerCluster/del',
        type: 'post',
        sysModule: global.cmdb
    }, {
        name: 'getDockerForSelect',
        method: 'getDockerForSelect',
        path: '/dockerCluster/getForSelect',
        type: 'post',
        sysModule: global.cmdb
    },

    //k8s cluster
    {
        name: 'k8sClusterList',
        method: 'k8sClusterList',
        path: '/k8sCluster/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveK8sCluster',
        method: 'saveK8sCluster',
        path: '/k8sCluster/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'k8sClusterDetail',
        method: 'k8sClusterDetail',
        path: '/k8sCluster/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delK8sCluster',
        method: 'delK8sCluster',
        path: '/k8sCluster/del',
        type: 'post',
        sysModule: global.cmdb
    }, {
        name: 'getK8sForSelect',
        method: 'getK8sForSelect',
        path: '/k8sCluster/getForSelect',
        type: 'post',
        sysModule: global.cmdb
    },

    //instance
    {
        name: 'instanceList',
        method: 'instanceList',
        path: '/instance/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveInstance',
        method: 'saveInstance',
        path: '/instance/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'instanceDetail',
        method: 'instanceDetail',
        path: '/instance/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delInstance',
        method: 'delInstance',
        path: '/instance/del',
        type: 'post',
        sysModule: global.cmdb
    },

    //dockerRepository
    {
        name: 'dockerRepositoryList',
        method: 'dockerRepositoryList',
        path: '/dockerRepository/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveDockerRepository',
        method: 'saveDockerRepository',
        path: '/dockerRepository/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'dockerRepositoryDetail',
        method: 'dockerRepositoryDetail',
        path: '/dockerRepository/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delDockerRepository',
        method: 'delDockerRepository',
        path: '/dockerRepository/del',
        type: 'post',
        sysModule: global.cmdb
    }, {
        name: 'getDockerRepositoryForSelect',
        method: 'getDockerRepositoryForSelect',
        path: '/dockerRepository/getForSelect',
        type: 'post',
        sysModule: global.cmdb
    }, {
        name: 'getRepositoryProjects',
        method: 'getRepositoryProjects',
        path: '/dockerRepository/getRepositoryProjects',
        type: 'post',
        sysModule: global.cmdb
    },


    //dnsPrivateDomain
    {
        name: 'dnsPrivateDomainList',
        method: 'dnsPrivateDomainList',
        path: '/dnsPrivateDomain/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveDnsPrivateDomain',
        method: 'saveDnsPrivateDomain',
        path: '/dnsPrivateDomain/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'dnsPrivateDomainDetail',
        method: 'dnsPrivateDomainDetail',
        path: '/dnsPrivateDomain/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delDnsPrivateDomain',
        method: 'delDnsPrivateDomain',
        path: '/dnsPrivateDomain/del',
        type: 'post',
        sysModule: global.cmdb
    },

    //dnsPrivateResolution
    {
        name: 'dnsPrivateResolutionList',
        method: 'dnsPrivateResolutionList',
        path: '/dnsPrivateResolution/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveDnsPrivateResolution',
        method: 'saveDnsPrivateResolution',
        path: '/dnsPrivateResolution/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'dnsPrivateResolutionDetail',
        method: 'dnsPrivateResolutionDetail',
        path: '/dnsPrivateResolution/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delDnsPrivateResolution',
        method: 'delDnsPrivateResolution',
        path: '/dnsPrivateResolution/del',
        type: 'post',
        sysModule: global.cmdb
    },

    //dnsPrivateBlacklist
    {
        name: 'dnsPrivateBlacklistList',
        method: 'dnsPrivateBlacklistList',
        path: '/dnsPrivateBlacklist/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveDnsPrivateBlacklist',
        method: 'saveDnsPrivateBlacklist',
        path: '/dnsPrivateBlacklist/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'dnsPrivateBlacklistDetail',
        method: 'dnsPrivateBlacklistDetail',
        path: '/dnsPrivateBlacklist/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delDnsPrivateBlacklist',
        method: 'delDnsPrivateBlacklist',
        path: '/dnsPrivateBlacklist/del',
        type: 'post',
        sysModule: global.cmdb
    },

    //dnsPublicDomain
    {
        name: 'dnsPublicDomainList',
        method: 'dnsPublicDomainList',
        path: '/dnsPublicDomain/list',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'saveDnsPublicDomain',
        method: 'saveDnsPublicDomain',
        path: '/dnsPublicDomain/save',
        type: 'post',
        dataType: 'json',
        sysModule: global.cmdb
    },
    {
        name: 'dnsPublicDomainDetail',
        method: 'dnsPublicDomainDetail',
        path: '/dnsPublicDomain/detail',
        type: 'post',
        sysModule: global.cmdb
    },
    {
        name: 'delDnsPublicDomain',
        method: 'delDnsPublicDomain',
        path: '/dnsPublicDomain/del',
        type: 'post',
        sysModule: global.cmdb
    },

]
