import { transDate, getDay } from 'utils/'
import fa from "element-ui/src/locale/lang/fa";
import { cache } from "../../../utils";

export default {
    name: 'project',
    data() {
        return {
            isEdit: false,
            saveLoading: false,
            //弹窗表单
            saveForm: {
                id: '',
                projectName: '',
                datasourceId: '',
                organName: '',
                providerSet: '',
                packageName: '',
                version: '',
                author: '',
                since: '',
                copyright: '',
                remark: '',
                extraOptions: [],
                organType: '',
            },
            // 表单规则
            rules: {
                projectName: [
                    { required: true, message: 'Project name is requires', trigger: 'change' },
                    {
                        validator: function (rule, value, callback) {
                            if (/^[a-zA-Z]+[a-zA-Z0-9]+$/.test(value)) {
                                callback(); // Pass
                            } else {
                                callback(new Error("Project name can only be a combination of upper and lower case letters and numbers, The initial letter can only be a letter and the total length is greater than 1"));
                            }
                        },
                        trigger: "change"
                    }
                ],
                organType: [
                    { required: true, message: 'Organ type is requires. e.g: com|io|org|cn', trigger: 'change' },
                    {
                        validator: function (rule, value, callback) {
                            if (/^[a-zA-Z]+[a-zA-Z0-9]+$/.test(value)) {
                                callback(); // Pass
                            } else {
                                callback(new Error("Organ type can only be a combination of upper and lower case letters and numbers, The initial letter can only be a letter and the total length is greater than 1"));
                            }
                        },
                        trigger: "change"
                    }
                ],
                organName: [
                    { required: true, message: 'Organ name is requires. e.g: mycompany', trigger: 'change' },
                    {
                        validator: function (rule, value, callback) {
                            if (/^[a-zA-Z]+[a-zA-Z0-9]+$/.test(value)) {
                                callback(); // Pass
                            } else {
                                callback(new Error("Organ name can only be a combination of upper and lower case letters and numbers, The initial letter can only be a letter and the total length is greater than 1"));
                            }
                        },
                        trigger: "change"
                    }
                ],
                version: [
                    { required: true, message: 'Verion is requires', trigger: 'change' },
                ],
                author: [
                    { required: true, message: 'Authors is requires', trigger: 'change' },
                ],
                providerSet: [
                    { required: true, message: 'Generators group is requires', trigger: 'change' },
                ],
                selectedValue: [
                    { required: true, message: 'At least one configuration item must be selected', trigger: 'change' },
                ],
            },
            loading: false,
            datasources: [],
            genProviderSet: [],
        }
    },

    activated() {
        this.cleanSaveForm();
        this.getDatasources();
        this.getGenProviderSet();
        const id = this.$route.query.id;
        this.saveForm.id = id;
        if (id) {//edit
            this.isEdit = true;
            this.editData();
        } else {//add
            this.isEdit = false;
        }

    },
    mounted() {
        //this.getData();
    },
    methods: {
        cleanSaveForm() {
            this.saveForm = {
                id: '',
                projectName: 'myproject',
                datasourceId: '',
                organName: 'mycompany',
                packageName: '',
                providerSet: '',
                version: '0.0.1-SNAPSHOT',
                author: this.getUsername(),
                since: 'v1.0',
                copyright: '/*\n' +
                    ' * Copyright 2017 ~ 2025 the original author or authors. <wanglsir@gmail.com, 983708408@qq.com>\n' +
                    ' *\n' +
                    ' * Licensed under the Apache License, Version 2.0 (the "License");\n' +
                    ' * you may not use this file except in compliance with the License.\n' +
                    ' * You may obtain a copy of the License at\n' +
                    ' *\n' +
                    ' *      http://www.apache.org/licenses/LICENSE-2.0\n' +
                    ' *\n' +
                    ' * Unless required by applicable law or agreed to in writing, software\n' +
                    ' * distributed under the License is distributed on an "AS IS" BASIS,\n' +
                    ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
                    ' * See the License for the specific language governing permissions and\n' +
                    ' * limitations under the License.\n' +
                    ' */',
                remark: '',
                extraOptions: [],
                organType: 'com',
            };
        },
        saveData() {
            this.dialogLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.dealPackageName();
                    this.$$api_lcdp_saveProject({
                        data: this.saveForm,
                        fn: json => {
                            this.back();
                            this.saveLoading = false;
                        },
                        errFn: () => {
                            this.saveLoading = false;
                        }
                    });
                } else {
                    this.saveLoading = false;
                }
            });
        },
        getDatasources() {
            this.$$api_lcdp_getDatabaseForSelect({
                data: {},
                fn: json => {
                    this.datasources = json.data;
                    if (json.data && json.data[0] && !this.saveForm.datasourceId) {
                        this.saveForm.datasourceId = json.data[0].id;
                    }
                }
            });
        },
        dealPackageName() {
            this.saveForm.packageName = this.saveForm.organType + '.' + this.saveForm.organName + '.' + this.saveForm.projectName;
        },
        editData() {
            this.$$api_lcdp_projectDetail({
                data: {
                    id: this.saveForm.id,
                },
                fn: json => {
                    if (!json.data.extraOptions || !json.data.extraOptions) {
                        json.data.extraOptions = [];
                    }
                    if (json.data.organType && json.data.organName && json.data.projectName) {
                        json.data.packageName = json.data.organType + '.' + json.data.organName + '.' + json.data.projectName;
                    }
                    this.saveForm = json.data;

                    this.extraOptions();
                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Edit';
        },
        getUsername() {
            return cache.get('login_username')
        },
        back() {
            this.$router.push({ path: this.permitutil.getRoutePathByPermission('udc:codegen:project')})
        },
        getGenProviderSet() {
            this.$$api_lcdp_getGenProviderSet({
                fn: json => {
                    this.genProviderSet = json.data;
                },
            })
        },
        extraOptions() {
            this.$$api_lcdp_extraOptions({
                data: {
                    providerSet: this.saveForm.providerSet,
                },
                fn: json => {
                    this.mergeExtraOption(json.data, this.saveForm.extraOptions);
                    this.saveForm.extraOptions = json.data;
                },
            })
        },
        mergeExtraOption(latestOptions, lastOptions) {
            for (let i in latestOptions) {
                let lastSelectedValue = this.getLastSelectedValue(lastOptions, latestOptions[i].provider, latestOptions[i].name);
                if (lastSelectedValue) {
                    latestOptions[i].selectedValue = lastSelectedValue;
                } else { // Default to first
                    latestOptions[i].selectedValue = latestOptions[i].values[0];
                }
            }
        },
        getLastSelectedValue(lastOptions, provider, name) {
            for (let i in lastOptions) {
                if (lastOptions[i].provider == provider && lastOptions[i].name == name) {
                    return lastOptions[i].selectedValue;
                }
            }
            return null;
        }
    }
}
