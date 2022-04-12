import i18n from '../../../../i18n/i18n'
export default {
    name: 'accessKey',
    data() {
        return {
            column: [
                {
                  label: 'AccessKey',
                  prop: 'appName'
                },
                {
                  label: '状态',
                  prop: 'appURL'
                },
                {
                  label: '最后使用时间',
                  prop: 'bootstrapScript'
                },
                {
                  label: '创建时间',
                  prop: 'bootstrapScript'
                }
            ],
            tableData:[
                {
                    "appName":'AccessKeyID'
                }
            ],
            dialogVisible:false,
            detialVisible:false,
            message:'123',
            keyMessage:'12322',
            saveForm:{
                phoneNumber:"12345678912",
                verificationCode:'',
            },
            codeText:'发送验证码',
            codeButtonType:false,
            timer:null,
            count:0
              
        }
    },

    activated() {

    },
    computed:{
    },

    mounted() {
        this.saveForm.phoneNumber = this.saveForm.phoneNumber.replace(this.saveForm.phoneNumber.substr(3, 4),"****")
    },

    methods: {
        add(){
            this.dialogVisible = true
        },
        sendVerificationCode(){
            this.codeText = '60 秒后重发'
            this.codeButtonType = true
            const TIME_COUNT = 60;
            if(!this.timer){
                this.count = TIME_COUNT;
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                        this.codeText = `${this.count} 秒后重发`
                    } else {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.codeText = '发送验证码'
                        this.codeButtonType = false
                    }
                }, 1000)
            }
        },
        handleDetail(){
            this.detialVisible = true
        },
        copyAccessKey(){
            this.$message({
                message: '已复制 AccessKey',
                type: 'success'
            });
        },
        copyAccessSecret(){
            this.$message({
                message: '已复制 AccessSecret',
                type: 'success'
            });
        }

    }
}