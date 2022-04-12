export default {
    name: 'passWord',
    data() {
        return {
            dialog: {
                show_access: false,
                show_set: false,
                show_pass: false,
                title: '修改密码',
                user_info: this.$store.state.user.userinfo,
                set_info: {
                    login_style: '',
                    disabled_update_pass: [],
                    select_users: []
                },
                user_info_rules: {
                    old_password: [{
                        required: true,
                        message: '旧密码不能为空！',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '新密码不能为空！',
                        trigger: 'blur'
                    }, {
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请再次输入密码'))
                            } else {
                                if (this.dialog.user_info.password !== '') {
                                    this.$refs.user_info.validateField('password_confirm')
                                }
                                callback()
                            }
                        }
                    }],
                    password_confirm: [{
                        required: true,
                        message: '确认密码不能为空！',
                        trigger: 'blur'
                    }, {
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请再次输入密码'))
                            } else if (value !== this.dialog.user_info.password) {
                                callback(new Error('两次输入密码不一致!'))
                            } else {
                                callback()
                            }
                        }
                    }]
                },
            },
        }
    },

    activated() {

    },

    mounted() {
    },

    methods: {
        /**
         * 修改密码
         * @param  {object} userinfo 当前修改密码的表单信息
         */
         updUserPass(userinfo) {
            this.$refs[userinfo].validate((valid) => {
                if (valid) {
                    this.$$api_user_updatePass({
                        data: {
                            old_password: this.dialog[userinfo].old_password,
                            password: this.dialog[userinfo].password,
                            password_confirm: this.dialog[userinfo].password_confirm
                        },
                        fn: data => {
                            this.dialog.show_pass = false
                            this.$message.success('修改成功！')
                        }
                    })
                }
            })
        },
    }
}