var merge = require('webpack-merge')
var baseEnv = require('./base.env')

module.exports = merge(baseEnv, {
    NODE_ENV: '"development"',
    // 可选(standalone|cluster), 为了开发环境简单方便可使用 standalone 模式，可自行调整，与后端对应模式启动即可。
    RUNTIME_MODE: `"standalone"`,
})
