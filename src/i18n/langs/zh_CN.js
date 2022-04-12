import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const zh_CN = {
    message: {
        'common': {
            'profile': '账号信息',
            'help': '帮助',
            'logout': '注销登录',
            'home': '主页',
            'language': '语言',
            'createDate': '创建日期',
            'createBy': '创建人',
            'updateDate': '更新日期',
            'updateBy': '更新人',
            'edit': '编辑',
            'detail': '详情',
            'del': '删除',
            'operation': '操作',
            'remark': '备注',
            'save': '保 存',
            'cancel': '取消',
            'search': '查询',
            'selectAll': '全选',
            'status': '状态',
            'type': '类型',
            'stop': '停止',
            'rollback': '回滚',
            'lastStep': '上一步',
            'nextStep': '下一步',
            'enable': '启用',
            'total': '全部',
            'name': '名称',
            'enName': '英文名称',
            'displayName': '中文名称',
            'baseUrl': '基本url',
            'username': '账号名',
            'password': '密码',
            'sshKey': '密钥',
            'sshKeyPub': '公钥',
            'token': 'Token',
            'addChild': '添加下级',
            'addTop': '添加顶级',
            'add': '新增',
            'create': '创建',
            'icon': '图标',
            'sort': '排序',
            'group': '分组',
            'email': '邮箱',
            'phone': '手机号',
            'refresh': '刷新',
            'endpoint': '端点/端口',
            'classify': '类别',
            'download': '下载',
            'accessToken': 'AccessToken',
            'upload': '上传',
            'light': '白天',
            'night': '夜晚',
            'back': '返回',
            'owner': '所有者',
            'manager': '管理',
            'startTime': '开始时间',
            'endTime': '结束时间',
            'searchInput': '请输入关键字',
        },
        'ci': {
            'instances': '实例',
            'cluster': '集群',
            'project': '项目名',
            'lockStatus': '项目名',
            'vcsProvider': 'vcs供应商',
            'pcmProvider': 'pcm供应商',
            'repositoryProject': '存储库项目名',
            'httpUrl': '存储库http地址',
            'sshUrl': '存储库ssh地址',
            'assetsPath': '构建包文件',
            'appInstallHome': '应用程序安装目录',
            'dependencies': '依赖',
            'dependent': '依赖',
            'branchName': '分支名',
            'pipeName': '名称',
            'pipeId': '任务Id',
            'pipeKind': '类型',
            'build': '构建',
            'env': '环境',
            'branchType': '分支类型',
            'buildCommand': '编译命令',
            'preCommand': '前置命令',
            'postCommand': '后置命令',
            'contactGroup': '联系人分组',
            'contact': '联系人',
            'custom': '自定义命令',
            'commands': '自定义编译命令',
            'trackType': '跟踪类型',
            'trackId': '跟踪id',
            'costTime': '消耗(秒)',
            'cron': 'cron表达式',
            'authType': '认证类型',
            'projectId': '项目id',
            'analyzerKind': '分析引擎',
            'assetVersion': '资产版本号',
            'assetBytes': '文件字节数',
            'assetAnalysisSize': '资产文件数量',
            'bugCollectionFile': '扫描结果文件',
            'issue': '问题',
            'annex': '附件',
            'isBoot': '是否可启',
            'pipeline': 'Pipeline',
            'priority': '优先级',
            'run': '执行',
        },
        'iam': {
            'navEntryName': '产品与服务',
            'menu': '菜单',
            'contactPhone': '联系手机号',
            'address': '地址',
            'permission': '权限',
            'server': '服务',
            'principal': '账户',
            'host': '主机',
            'startTime': '开始时间',
            'lastAccessTime': '最后登录时间',
            'clientRef': '客户端',
            'authenticated': '通过认证',
            'destroy': '销毁',
            'roleCode': '角色编码',
            'role': '角色',
            'pageLocation': '页面地址',
            'routePath': '路由地址',
            'contactChannel': '联系渠道',
            'contactType': '渠道',
            'primaryAddress': 'PrimaryAddress',
        },
        'scm': {
            'node': '节点',
            'namespace': '命名空间',
            'content': '内容',
            'port': '端口',
            'signature': '签名',
            'algorithm': '算法',
            'tag': '标签',
        },
        'share': {
            'sshUser': 'ssh用户',
            'sshKey': 'ssh私钥',
            'sshKeyPub': 'ssh公钥',
            'timeOfFreq': '频率时间',
            'numOfFreq': '频率次数',
            'dingtalk': '钉钉',
            'wechat': '微信',
            'twitter': '推特',
            'facebook': '脸书',
            'key': 'Key',
            'label': '标签',
            'labelEn': '英文标签',
            'value': '值',
            'theme': '主题',
            'connectTest': '测试连接',
            'copy': '克隆',
            'generateSshKey': '由系统生成',
        },
        'srm': {
            'level': '等级',
            'keyword': '关键字',
            'flush': 'Flush',
            'filter': '过滤',
            'include': '包含',
            'policy': '策略',
            'relativeTime': '相对时间',
            'customTime': '自定义时间',
        },
        'umc': {
            'template': '模版',
            'callbackUrl': '回调地址',
            'metric': '度量',
            'alarmTime': '提醒时间',
            'alarmNote': '提醒内容',
            'gatherTime': '采集时间',
            'rule': '规则',
            'logicalOperator': '逻辑运算符',
            'aggregator': '聚合器',
            'relateOperator': '相关运算符',
            'queueTime': '排队时间',
            'alarmLevel': '提醒等级',
            'compareValue': '比较值',
            'dataSourceProvide': '数据库类型',
            'dataSourceUrl': '数据库地址',
            'dataSourceUserName': '数据库用户',
            'dataSourcePassword': '数据库密码',
            'alarmMessage': '通知消息',
            'dataSourceName': '数据库名称',
            'costTime': '消耗时间(Ms)',
        },
        'doc': {
            'fileType': '文件类型',
            'description': '说明',
            'history': '历史记录',
            'compare': '历史比较',
            'share': '分享',
            'browse': '浏览',
            'shareCode': '分享编码',
            'shareTime': '分享日期',
            'expireTime': '过期时间',
            'docName': '文档名称',
            'withPasswordLink': '加密外链',
            'withNoPasswordLink': '直接外链',
            'cancelShare': '取消分享',
        },
        'coss': {
            'fileSize': '文件大小',
            'prefix': '前缀',
            'cossProvider': 'Coss提供者',
            'acl': '权限',
        },

    },
    'elasticjob': {
        'common': {
            'home': '主页',
            'menuData': [
                {
                    'title': '应用',
                    'child': [
                        /* {
                          title: '注册中心配置',
                          href: '/registry-center'
                        },*/
                        {
                            title: '配置',
                            href: '/app-config'
                        }
                    ]
                },
                {
                    title: '作业',
                    child: [
                        {
                            title: '配置',
                            href: '/job-config'
                        },
                        {
                            title: '状态',
                            href: '/job-status'
                        }
                    ]
                },
                {
                    title: '作业历史',
                    child: [
                        {
                            title: '历史dashboard',
                            href: '/history-dashboard'
                        },
                        {
                            title: '作业历史轨迹',
                            href: '/history-trace'
                        },
                        {
                            title: '作业运行状态',
                            href: '/history-status'
                        }
                    ]
                }
            ],
            connect: '已连接',
            connection: '连接',
            del: '删除',
            notify: {
                title: '提示',
                addSucMessage: '添加成功',
                editSucMessage: '修改成功',
                actionSucMessage: '操作成功',
                conSucMessage: '连接成功',
                conFailMessage: '连接失败',
                delSucMessage: '删除成功',
                delFailMessage: '删除失败',
                updateCompletedMessage: '更新成功',
                updateFaildMessage: '更新失败',
                appNotRegisterMessage: '应用未注册',
                confirmDelOperator: '确认删除'
            },
            loginOut: '退出登录',
            dropdownList: [
                {
                    title: '中文',
                    command: 'Chinese'
                },
                {
                    title: 'English',
                    command: 'English'
                }
            ]
        },
        'login': {
            btnTxt: '登录',
            labelUserName: '用户名',
            labelPassword: '密码'
        },
        'btn': {
            submit: '提交',
            reset: '重置',
            cancel: '取消',
            confirm: '确定'
        },
        'input': {
            pUserName: '请输入用户名',
            pPaasword: '请输入密码'
        },
        'registryCenter': {
            btnTxt: '添加',
            registDialog: {
                title: '添加注册中心',
                editTitle: '编辑注册中心',
                name: '注册中心名称',
                centerType: '注册中心类型',
                address: '注册中心地址',
                orchestrationName: '数据治理实例',
                namespaces: '命名空间',
                digest: '登录凭证',
                btnConfirmTxt: '确定',
                btnCancelTxt: '取消'
            },
            table: {
                operate: '操作',
                operateConnect: '连接',
                operateConnected: '已连接',
                operateDel: '删除',
                operateEdit: '编辑'
            },
            rules: {
                name: '请输入注册中心名称',
                centerType: '请选择注册中心类型',
                namespaces: '请输入命名空间',
                address: '请选输入注册中心地址',
                orchestrationName: '请输入数据治理实例名称',
                digest: '请输入登录凭证'
            }
        },
        'appConfig': {
            'btnTxt': '添加',
            'addDialog': {
                'title': '添加应用',
                'appName': '应用名称',
                'script': '启动脚本',
                'cpu': 'CPU核数',
                'memory': '占用内存(MB)',
                'sampling': '作业事件采样次数(仅Daemon)',
                'cacheEnable': '是否在本地缓存应用',
                'appURL': '应用所在路径'
            },
            'dialog': {
                'editTitle': '修改应用',
                'detailTitle': '应用详情'
            },
            'table': {
                'appName': '应用名称',
                'appUrl': '应用所在路径',
                'script': '启动脚本',
                'operate': '操作',
                'operateDetail': '详情',
                'operateModify': '修改',
                'operateDel': '删除',
                'operateDisable': '失效',
                'operateEnable': '生效'
            },
            'rules': {
                'appName': '请输入应用名称',
                'appURL': '请输入应用所在路径',
                'bootstrapScript': '请输入启动脚本',
                'cpuCount': '请输入CPU核数',
                'memoryMB': '请输入内存占用',
                'eventTraceSamplingCount': '请输入作业事件采样次数'
            },
            'tips': {
                'disableSuccess': '失效成功',
                'enableSuccess': '生效成功'
            }
        },
        'jobConfig': {
            'labelInfo': {
                'addBtnText': '添加',
                'jobName': '作业名称',
                'appName': '应用名称',
                'shardingTotalCount': '作业分片总数',
                'cron': 'Cron表达式',
                'description': '作业描述信息',
                'status': '状态',
                'jobExecutionType': '执行类型',
                'jobParameter': '自定义参数',
                'cpuCount': 'CPU核数',
                'memoryMB': '单片作业内存(MB)',
                'failover': '支持自动失效转移',
                'misfire': '支持错过重执行',
                'applicationContext': 'Spring配置文件相对路径及名称',
                'shardingItemParameters': '分片序列号/参数对照表',
                'scriptCommandLine': 'SCRIPT类型作业命令行执行脚本',
                'streamingProcess': '是否流式处理数据',
                'beanName': '实体名称',
                'addTitle': '添加作业',
                'editTitle': '修改作业',
                'operate': '操作'
            },
            'rules': {
                'jobName': '请输入作业名称',
                'appName': '请输入应用名称',
                'jobExecutionType': '请选择执行类型',
                'shardingTotalCount': '请输入作业分片总数',
                'applicationContext': 'META-INF\\applicationContext.xml',
                'shardingItemParameters': '0=a,1=b,2=c',
                'cron': '请输入Cron表达式',
                'cpuCount': '请输入CPU核数',
                'memoryMB': '请输入单片作业内存(MB)',
                'description': '请输入作业描述信息',
                'status': '请选择作业状态'
            },
            'statusText': {
                'OK': '正常',
                'DISABLED': '已失效',
                'CRASHED': '已下线',
                'PENDING': '等待运行',
                'SHARDING_FLAG': '分片待调整'
            },
            'actionText': {
                'modify': '修改',
                'detail': '详情',
                'trigger': '触发',
                'disable': '失效',
                'enable': '生效',
                'shutdown': '终止',
                'remove': '删除'
            }
        },
        'jobStatus': {
            'tab': {
                'running': '运行任务',
                'ready': '待运行任务',
                'failover': '待失效转移任务'
            },
            'labelInfo': {
                'id': '任务主键',
                'taskName': '任务名称',
                'jobName': '作业名称',
                'severIp': '服务器IP',
                'type': '执行类型',
                'shardingItems': '分片项',
                'times': '剩余执行次数',
                'originalTaskId': '原任务主键',
                'operate': '操作'
            }
        },
        'historyTrace': {
            'column': {
                'jobName': '作业名称',
                'taskId': '任务主键',
                'serverIp': '服务器IP',
                'executeSource': '执行来源',
                'executeResult': '执行结果',
                'failureCause': '失败原因',
                'startTime': '开始时间',
                'completeTime': '完成时间'
            },
            'searchForm': {
                'jobName': '请输入作业名称',
                'taskId': '请输入任务主键',
                'serverIp': '请输入服务器IP',
                'startTime': '请输入开始时间',
                'CompleteTime': '请输入完成时间',
                'executeResult': '请选择执行结果',
                'executeSuccess': '成功',
                'executeFailed': '失败'
            }
        },
        'historyStatus': {
            'column': {
                'jobName': '作业名称',
                'taskId': '任务主键',
                'serverIp': '服务器IP',
                'executeSource': '执行来源',
                'shardingItem': '分片项',
                'executeType': '执行类型',
                'state': '状态',
                'createTime': '创建时间',
                'remark': '备注'
            },
            'searchForm': {
                'jobName': '请输入作业名称',
                'taskId': '请输入任务主键',
                'serverIp': '请输入服务器IP',
                'executeSource': '请选择执行来源',
                'executeType': '请选择执行类型',
                'startTime': '请输入创建开始时间',
                'CompleteTime': '请输入创建结束时间',
                'state': '选择状态',
                'stateStaging': '等待运行',
                'stateFailed': '运行失败',
                'stateFinished': '已完成',
                'stateRunning': '运行中',
                'stateError': '启动失败',
                'stateKilled': '主动终止'
            }
        },
        'historyDashboard': {
            'successAndFailCount': '作业成功/失败数',
            'jobType': '作业分类',
            'jobExecutionTypeJob': '作业执行类型',
            'jobTaskRunningCount': '作业/任务运行数',
            'currentJobsCount': '接入平台作业数',
            'jobInfoForOneMinute': '一分钟作业情况',
            'jobInfoForOneHour': '一小时作业情况',
            'jobInfoForOneWeek': '一周作业情况',
            'jobSuccessCount': '作业成功数',
            'jobFailureCount': '作业失败数',
            'taskRunningCount': '任务运行数',
            'jobRunningCount': '作业运行数',
            'success': '成功',
            'failed': '失败'
        }
    },
    shardingsphere: {
        common: {
            home: '主页',
            menuData: [
                {
                    title: '分布式治理',
                    child: [
                        {
                            title: '注册中心',
                            href: '/registry-center'
                        },
                        {
                            title: '配置管理',
                            href: '/rule-config'
                        },
                        {
                            title: '运行状态',
                            href: '/runtime-status'
                        }
                    ]
                },
                {
                    title: '数据扩容',
                    href: '/data-scaling'
                }
            ],
            connect: '已连接',
            connection: '连接',
            del: '删除',
            notify: {
                title: '提示',
                addSucMessage: '添加成功',
                editSucMessage: '修改成功',
                conSucMessage: '连接成功',
                conFailMessage: '连接失败',
                delSucMessage: '删除成功',
                delFailMessage: '删除失败',
                updateCompletedMessage: '更新成功',
                updateFaildMessage: '更新失败',
                confirmDelOperator: '确认删除'
            },
            currentRegistryCenter: '已连接注册中心',
            loginOut: '退出登录',
            dropdownList: [
                {
                    title: '中文',
                    command: 'Chinese'
                },
                {
                    title: 'English',
                    command: 'English'
                }
            ]
        },
        login: {
            btnTxt: '登录',
            labelUserName: '用户名',
            labelPassword: '密码'
        },
        btn: {
            submit: '提交',
            reset: '重置',
            cancel: '取消',
            confirm: '确定'
        },
        input: {
            pUserName: '请输入用户名',
            pPaasword: '请输入密码'
        },
        registryCenter: {
            btnTxt: '添加',
            registDialog: {
                title: '添加注册中心',
                editTitle: '编辑注册中心',
                name: '注册中心名称',
                centerType: '注册中心类型',
                address: '注册中心地址',
                governanceName: '治理实例名称',
                namespaces: '命名空间',
                digest: '登录凭证',
                btnConfirmTxt: '确定',
                btnCancelTxt: '取消'
            },
            table: {
                operate: '操作',
                operateConnect: '连接',
                operateConnected: '已激活',
                operateDel: '删除',
                operateEdit: '编辑'
            },
            rules: {
                name: '请输入注册中心名称',
                centerType: '请选择注册中心类型',
                namespaces: '请输入命名空间',
                address: '请输入注册中心地址',
                additionalAddress: '请输入扩展配置中心地址',
                governanceName: '请输入治理实例名称',
                digest: '请输入登录凭证'
            }
        },
        runtimeStatus: {
            serviceNode: '服务节点',
            readDataSourceName: '读库信息',
            dataSource: {
                schema: '逻辑库名',
                writeDataSourceName: '写库名',
                readDataSourceName: '读库名'
            },
            instance: {
                instanceId: '节点标识',
                serverIp: '服务ip'
            },
            enabled: '是否启用'
        },
        ruleConfig: {
            form: {
                inputPlaceholder: '请输入内容'
            },
            schema: {
                title: '添加Schema',
                name: '名称',
                ruleConfig: '分片配置规则',
                dataSourceConfig: '数据源配置规则'
            },
            schemaRules: {
                name: '请输入名称',
                ruleConfig: '请输入数据分片配置规则',
                dataSourceConfig: '请输入数据源配置规则'
            },
            radioBtn: {
                schema: '数据源',
                authentication: '认证信息',
                props: '属性配置'
            }
        },
        dataScaling: {
            btnTxt: '添加',
            tableList: {
                jobId: '任务Id',
                jobName: '任务名称',
                status: '状态',
                operate: '操作',
                operateStop: '停止',
                operateSee: '查看'
            },
            registDialog: {
                title: '添加一个任务',
                source: '源',
                target: '目标',
                jobCount: '任务数量',
                jobCountPlaceholder: '请输入任务数量',
                username: '用户名',
                usernamePlaceholder: '请输入用户名',
                password: '密码',
                passwordPlaceholder: '请输入密码',
                url: '地址',
                urlPlaceholder: '请输入 url',
                btnConfirmTxt: '确认',
                btnCancelTxt: '取消'
            },
            rules: {
                source: '请选择注册中心的来源',
                target: '请选择目标',
                serviceUrl: '服务地址必填'
            },
            notify: {
                title: '提示',
                conSucMessage: '添加成功',
                conFailMessage: '添加失败',
                delSucMessage: '删除成功',
                delFailMessage: '删除失败'
            },
            serviceDialog: {
                title: '数据扩容配置',
                serviceName: '服务名称',
                serviceUrl: '服务地址',
                serviceNamePlaceholder: '请输入服务名称',
                serviceUrlPlaceholder: '请输入服务地址'
            },
            detail: {
                inventory: '存量',
                increment: '增量',
                taskId: '子任务Id',
                shardingItem: '分片项',
                delay: '延迟(秒)',
                total: '总任务数',
                finished: '已完成任务数'
            }
        }
    },


    ...zhLocale
}

export default zh_CN
