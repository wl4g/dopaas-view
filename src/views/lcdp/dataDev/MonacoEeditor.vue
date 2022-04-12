<template>
    <div class="myEditor">
        <p style="display: flex;justify-content: space-between;padding-bottom: 1vw;" v-if="showTheme||runningButton">
            <span class="theme" v-if="showTheme">
                <el-select v-model="theme" size="mini" @change="themeChange" placeholder="请选择主题">
                    <el-option
                        v-for="item in themeOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <el-button v-if="runningButton" type="success" @click="RunResult">运行</el-button>
        </p>
        <div id="container" ref="container" style="height:95%"></div>
    </div>
</template>
<script>
import { format } from 'sql-formatter';
import * as monaco from 'monaco-editor';
export default {
    props:{
        codes:{
            type:String,
            default:function(){
                return '<div>请编辑内容</div>'
            }
        },
        showTheme:{
            type:Boolean,
            default:function(){
                
            }
        },
        runningButton:{
            type:Boolean,
            default:function(){
                
            }
        },
        language:{
            type:String,
            default:function(){
                return 'html'
            }
        },
        editorOptions:{
            type:Object,
            default:function(){
                return {
                    monacoEditor:null,
                    autoIndent:true,//自动缩进
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,        // 只读
                    cursorStyle: 'line',        //光标样式
                    automaticLayout: false, //自动布局
                    glyphMargin: true,  //字形边缘
                    useTabStops: false,
                    formatDocument:true,
                    fontSize: 28,       //字体大小
                    // quickSuggestionsDelay: 500,   //代码提示延时
                }
            }
        }
    },
    data(){
        return{
            themeOption:[
                {
                    value:'vs',
                    label:'默认'
                },
                {
                    value:'hc-black',
                    label:'高亮'
                },
                {
                    value:'vs-dark',
                    label:'深色'
                },
            ],
            theme:'hc-black',
            codesCopy:null,//内容备份
            suggestions:[{
                label: '$123',
                kind: monaco.languages.CompletionItemKind['Function'], //这里Function也可以是别的值，主要用来显示不同的图标
                insertText: '123', // 如果没有此项，则无法插入
                detail: '$'
            }]
        }
    },
    mounted(){
        this.initEditor();
    },
    beforeDestroy(){
        
    },
    methods:{
        initEditor(changecode){
            let self = this;
            self.$refs.container.innerHTML = '';
            self.monacoEditor = monaco.editor.create(self.$refs.container, {
                value:changecode?changecode:self.codes,
                language: self.language,
                theme: self.theme,//vs, hc-black, or vs-dark
                editorOptions:self.editorOptions,
            });
            console.info(self.codes)
            console.info(self.monacoEditor.getValue())

            console.info('11111')
            monaco.languages.registerCompletionItemProvider(self.language, { // 这里以sql语言为例
            provideCompletionItems() {
                var suggestions = self.suggestions ;
				// 必须清除range，不然 .号后面东西都提示不了
				for (let i = 0; i < suggestions.length; i++) {
					const v = suggestions[i];
					delete v.range;
				}
                return {
                    suggestions: self.suggestions
                };
            },
            resolveCompletionItem(item, token) {
				return null;
			},
            triggerCharacters: ['$'] // 触发提示的字符，可以写多个
            });


            self.monacoEditor.setValue(format(self.monacoEditor.getValue()))//格式化SQL语句
            self.$emit('onMounted',self.monacoEditor);//编辑器创建完成回调
            self.monacoEditor.onDidChangeModelContent(function(event){//编辑器内容changge事件
                // self.codesCopy = self.monacoEditor.getValue();
                self.$emit('onCodeChange',self.monacoEditor.getValue(),event);
            });
            //编辑器随窗口自适应
            window.addEventListener('resize',function(){
                initEditor();
            })

        },
        RunResult(){
            console.log(this.monacoEditor.getValue());
            // this.$emit('runResult',this.monacoEditor.getValue())
        },
        themeChange(val){
            this.initEditor();
        }
    }
}
</script>
<style scoped>
    #container{
        height:100%;
        text-align: left;
    }