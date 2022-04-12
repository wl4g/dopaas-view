import dateutils from "../../../common/dateutils";
import global from "../../../common/global_variable";
import axios from 'axios'

export default {
    name: 'mdEdit',
    data() {
        var validateLabels = (rule, value, callback) => {
            if (value.length<=0) {
                callback(new Error('Label is Empty'));
            } else {
                callback();
            }
        };
        return {
            changesData: [],

            saveForm:{
                id: '',
                type: 'md',
                name: '',
                lang: '',
                content: '',
                description: '',
                docCode: '',
                labelIds: [],
            },

            oldContent: '',

            labelData: [],

            uploadUrl: global.getBaseUrl(global.cmdb,false)+'/fs/uploadImg',

            rules: {
                name: [
                    {required: true, message: 'Please Input name', trigger: 'change' },
                    { min: 1, max: 30, message: 'length between 1 to 30', trigger: 'blur' }
                ],
                lang: [
                    {required: true, message: 'Please select language', trigger: 'change' },
                ],
                labelIds: [
                    { validator: validateLabels,required: true, trigger: 'change' },
                ],
            },
        }
    },

    mounted() {

        const DOC_LINK_BASEURI = "₤DOC_LINK_BASEURI₤";
        const DOC_LINK_BASEURI_TRAN = "%E2%82%A4DOC_LINK_BASEURI%E2%82%A4";

        const  md = this.$refs.md.markdownIt;
        let defaultRender = md.renderer.rules.image;
        let baseUrl = global.getBaseUrl(global.cmdb,false);
        md.renderer.rules.image = function (tokens, idx, options, env, self) {
            if(!tokens){
                return defaultRender(tokens, idx, options, env, self);
            }
            for(let i in tokens){
                let attrs = tokens[i]['attrs'];
                for(let j in attrs){
                    let attr = attrs[j];
                    if(attr && attr[0] && attr[0]=='src' && attr[1]){
                        if(attr[1].indexOf(DOC_LINK_BASEURI_TRAN) != -1){
                            attr[1] = attr[1].replace(new RegExp(DOC_LINK_BASEURI_TRAN,'g'),baseUrl);
                        }else if (attr[1].indexOf(DOC_LINK_BASEURI) != -1){
                            attr[1] = attr[1].replace(new RegExp(DOC_LINK_BASEURI,'g'),baseUrl);
                        }
                    }
                }
            }
            return defaultRender(tokens, idx, options, env, self);
        };
    },

    activated() {
        this.getLabelData();
        this.cleanSaveForm();
        this.saveForm.id = this.$route.query.id;
        if(this.saveForm.id){
            this.detail();
        }
    },

    methods: {
        save(){
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    if(this.oldContent === this.saveForm.content){// not change , just go back
                        this.$router.push({path: this.permitutil.getRoutePathByPermission('udm:file')})
                    }
                    this.$$api_udm_saveDoc({
                        data:  this.saveForm,
                        fn: json => {
                            this.cleanSaveForm();
                            this.$router.push({path: this.permitutil.getRoutePathByPermission('udm:file')})
                        }
                    })
                } else {
                    console.log('validate fail!!');
                }
            });



        },
        goBack(){
            this.$router.push({path: this.permitutil.getRoutePathByPermission('udm:file')})
        },
        detail(){
            this.$$api_udm_docDetail({
                data: {
                    id: this.saveForm.id,
                },
                fn: json => {
                    if(json.data){
                        this.saveForm = json.data;
                        this.oldContent = json.data.content;
                    }
                    this.getChanges();
                }
            })
        },
        getChanges(){
            this.$$api_udm_getHistoryByDocCode({
                data: {
                    docCode: this.saveForm.docCode
                },
                fn: json => {
                    this.changesData = json.data;
                }
            })
        },
        cleanSaveForm(){
            this.saveForm = {
                id: '',
                type: 'md',
                name: '',
                lang: '',
                content: '',
                description: '',
                docCode: '',
                labelIds: [],
            };
            this.changesData = [];
            this.changesId = '';
        },
        changeChangesId(){
            this.detail();
        },
        getLabelData(){
            this.$$api_udm_allLabel({
                data: {},
                fn: json => {
                    this.labelData = json.data;
                }
            })
        },
        getHistoryLabel(item){
            let s = dateutils.dateFormat("YYYY-mm-dd HH:MM:SS", item.createDate);
            if( item.createByStr ){
                s = s + ' / ' + item.createByStr;
            }
            if(item.description && item.description.length>30){
                s = s +' / '+ item.description.substring(0,30)+'...';
            }else{
                s = s +' / ' + item.description;
            }
            return s;
        },
        imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
            var formdata = new FormData();
            formdata.append('img', $file);
            axios({
                url: this.uploadUrl,
                method: 'post',
                data: formdata,
                withCredentials:true,
                headers: { 'Content-Type': 'multipart/form-data' },
            }).then((data) => {
                // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                /**
                 * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                 * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                 * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                 */
                if(!data||!json.data||!json.data.data){
                    return;
                }
                if(json.data.code !== 200){
                    this.$message.error('上传图片失败');
                }
                this.$refs.md.$img2Url(pos, json.data.data);
            })
        },
        onFullScreen(status,value){
            if(status){// fullscreen
                //this.$store.state.leftmenu.menu_flag = false;
                this.$store.dispatch('set_menu_close')//'set_menu_open'
            }else{// not fullscreen
                //this.$store.state.leftmenu.menu_flag = true;
                this.$store.dispatch('set_menu_open')//
            }
        },

    },
}


