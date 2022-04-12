// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'register/'
import store from 'store/'
import dictutil from './common/dictutil'
import permitutil from './common/permitutil'
import globalVariable from './common/global_variable.js'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '../src/element-variables.scss'
import VueClipboard from 'vue-clipboard2'
import OrganizationSelector from './components/organization-selector';
import fsviewer from './components/fsviewer';
import SvgIcon from './layout/left-menu/svgIcon'
import i18n from '@/i18n/i18n'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@/utils/security/sysmodules'
import splitPane from 'vue-splitpane'
/*toastui-editor*/
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import '@toast-ui/editor/dist/i18n/zh-cn.js';

import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);

// import ace from 'ace-builds'
// Vue.use(ace)

Vue.prototype.dictutil = dictutil;
Vue.prototype.permitutil = permitutil;
Vue.prototype.GLOBAL = globalVariable;
Vue.use(ElementUI, { size: 'mini' });
Vue.use(mavonEditor);
Vue.use(VueClipboard);
Vue.component('organization-selector', OrganizationSelector);
Vue.component('fsviewer', fsviewer);
Vue.component('svg-icon', SvgIcon);
Vue.component('split-pane', splitPane);
Vue.component('editor', Editor);

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.directive('tableScroll', {
    bind (el, binding) {
    	// el-table 内容滚动区域
        const bodyWrap = el.querySelector('.el-table__body-wrapper')
        bodyWrap.addEventListener('scroll', function () {
            let sign = 0
            // 滚动到底部
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign) {
                binding.value()
            }
        })
    }
})


new Promise(resolve => {
    var iamModuleConfig = { "pluginName": "IamPlugin", "version": "v2.0.0", "modules": [{ "modName": "IamAllModule", "stable": "IAM.all.min.js", "grey": "IAM.all.js", "css_stable": "IAM.all.min.css", "css_grey": "IAM.all.css", "ratio": 100 }], "dependencies": [{ "features": ["IamAll"], "depends": ["IamAllModule"], "sync": true }] };
    new LoaderJS(iamModuleConfig).use("IamAll", function () {
        console.log("******* IAM JSSDK loaded completed! *******");
        resolve()
    })
}).then(() => {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        router,
        store,
        i18n,
        template: '<App/>',
        components: { App },
        beforeCreate() {
            console.debug('根组件：beforeCreate')
        },
        created() {
            console.debug('根组件：created')
        },
        beforeMount() {
            console.debug('根组件：beforeMount')
        },
        mounted() {
            console.debug('根组件：mounted')
        }
    });
})
