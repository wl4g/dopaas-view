/**
 * 导出所有模块需要用到接口
 * 一级属性：模块名
 * 一级属性中的方法：当前模块需要用的接口
 * @type {Object}
 */
import user from './user/'
import system from './system/'
import scm from './scm/'
import historic from './historic/'
import track from './track/'
import uci from './uci/'
import umc from './umc/'
import cmdb from './cmdb/'
import iam from './iam/'
import udm from './udm/'
import uos from './uos/'
import urm from './urm/'
import gw from './gw/'
import lcdp from './lcdp/'
import uds from './uds/'
import shardingsphere5 from './shardingsphere5/'
import shardingsphere4 from './shardingsphere4/'

export default [
    {
        module: 'user',
        name: '用户管理',
        list: user
    }, {
        module: 'system',
        name: '系统设置',
        list: system
    }, {
        module: 'scm',
        name: '版本管理',
        list: scm
    }, {
        module: 'historic',
        name: '版本管理',
        list: historic
    }, {
        module: 'track',
        name: '版本管理',
        list: track
    }, {
        module: 'uci',
        name: '部署管理',
        list: uci
    }, {
        module: 'umc',
        name: '部署管理',
        list: umc
    }, {
        module: 'cmdb',
        name: '公共管理',
        list: cmdb
    }, {
        module: 'iam',
        name: '权限管理',
        list: iam
    }, {
        module: 'udm',
        name: '文档管理',
        list: udm
    }, {
        module: 'uos',
        name: '文件系统',
        list: uos
    }, {
        module: 'urm',
        name: '文件系统',
        list: urm
    }, {
        module: 'gw',
        name: '文件系统',
        list: gw
    }, {
        module: 'lcdp',
        name: '开发者套件',
        list: lcdp
    }, {
        module: 'uds',
        name: 'uds',
        list: uds
    }, {
        module: 'shardingsphere5',
        name: 'shardingsphere5',
        list: shardingsphere5
    }, {
        module: 'shardingsphere4',
        name: 'shardingsphere4',
        list: shardingsphere4
    }
]
