import { getDay, transDate } from 'utils/'
import Sortable from 'sortablejs'

export default {
    name: 'tableedit',
    data() {
        return {
            isEdit: false,
            clickNext: false,
            //查询条件
            searchParams: {
                name: '',
            },
            //弹窗表单
            saveForm: {
                id: '',
                projectId: '',
                tableName: '',
                entityName: '',
                comments: '',
                parentTableName: '',
                parentTableFkName: '',
                dataSourceName: '',
                tplCategory: '',
                packageName: '',
                moduleName: '',
                subModuleName: '',
                functionName: '',
                functionNameSimple: '',
                functionAuthor: '',
                genBaseDir: '',
                options: '',
                status: '',
                genTableColumns: [],
                remark: '',
            },
            tableData: [],
            tables: [],
            dictTypes: [],
            attrTypes: [],
            filterSysTable: true,
            // 表单规则
            rules: {
                tableName: [
                    { required: true, message: 'You must select a table', trigger: 'change' },
                ],
                entityName: [
                    { required: true, message: 'Entity name is require', trigger: 'change' },
                ],
                functionAuthor: [
                    { required: true, message: 'Function author is require', trigger: 'change' },
                ],
                functionName: [
                    { required: true, message: 'Function name is require', trigger: 'change' },
                ],
                functionNameSimple: [
                    { required: true, message: 'Function simple name is require', trigger: 'change' },
                ],
                moduleName: [
                    { required: true, message: 'Module name is require', trigger: 'change' },
                    {
                        validator: function (rule, value, callback) {
                            if (/^[a-zA-Z]+[a-zA-Z0-9]+$/.test(value)) {
                                callback(); // Pass
                            } else {
                                callback(new Error("Module name can only be a combination of upper and lower case letters and numbers, The initial letter can only be a letter and the total length is greater than 1"));
                            }
                        },
                        trigger: "change"
                    }
                ],
                subModuleName: [
                    { required: false, message: 'Sub module name non is require', trigger: 'change' },
                    {
                        validator: function (rule, value, callback) {
                            if (/^[a-zA-Z]+[a-zA-Z0-9]+$/.test(value)) {
                                callback(); // Pass
                            } else {
                                callback(new Error("Sub module name can only be a combination of upper and lower case letters and numbers, The initial letter can only be a letter and the total length is greater than 1"));
                            }
                        },
                        trigger: "change"
                    }
                ],
            },
            loadGenColumnsLoading: false,
            saveLoading: false,
            activeName: 'first',
        }
    },
    activated() {
        this.cleanSaveForm();
        const id = this.$route.query.id;
        const projectId = this.$route.query.projectId;
        this.saveForm.id = id;
        this.saveForm.projectId = projectId;

        this.getAttrTypes(projectId);
        this.getTables();
        if (id) { // edit
            this.isEdit = true;
            this.clickNext = true;
            this.editData();
        } else { // add
            this.isEdit = false;
        }
    },
    mounted() {
        this.allDictType();
    },
    methods: {
        cleanSaveForm() {
            this.isEdit = false;
            this.clickNext = false;
            this.activeName = 'first';
            this.saveForm = {
                id: '',
                projectId: '',
                tableName: '',
                entityName: '',
                comments: '',
                parentTableName: '',
                parentTableFkName: '',
                dataSourceName: '',
                tplCategory: '',
                packageName: '',
                moduleName: '',
                subModuleName: '',
                functionName: '',
                functionNameSimple: '',
                functionAuthor: '',
                genBaseDir: '',
                options: '',
                status: '',
                genTableColumns: [],
                remark: '',
            };
        },
        getTables() {
            if (!this.saveForm.projectId) {
                return;
            }
            this.$$api_lcdp_findTables({
                data: { projectId: this.saveForm.projectId },
                fn: json => {
                    this.tables = json.data;
                }
            });
        },
        getFilterTables() {
            if (this.filterSysTable) {
                return this.tables.filter(item => {
                    //console.info(item);
                    return item.tableName.indexOf('sys_') < 0;
                })
            } else {
                return this.tables;
            }
        },
        setSort() {
            //const anchor = this.$el.querySelector("#pipe_step"+id);
            const el = this.$refs['dragTable'].$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
            this.sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                setData: function (dataTransfer) {
                    dataTransfer.setData('Text', '')
                },
                handle: ".handle-rank",
                onEnd: evt => {
                    const targetRow = this.saveForm.genTableColumns.splice(evt.oldIndex, 1)[0];
                    this.saveForm.genTableColumns.splice(evt.newIndex, 0, targetRow);
                    //打开注释可以看下顺序是否正确
                    /*for(let i in this.saveForm.genTableColumns){
                        console.info(this.saveForm.genTableColumns[i].columnName);
                    }*/
                }
            })
        },
        afterSelectTable() {
            this.$refs['selectTableForm'].validate((valid) => {
                if (valid) {
                    this.clickNext = true;
                    this.loadGenColumns();
                }
            });
        },
        nextStep() {
            if (this.activeName == 'first') {
                this.activeName = 'second';
            } else if (this.activeName == 'second') {
                this.activeName = 'third';
            } else if (this.activeName == 'third') {

            }
        },
        loadGenColumns() {
            this.loadGenColumnsLoading = true;
            this.$$api_lcdp_loadGenColumns({
                data: {
                    projectId: this.saveForm.projectId,
                    tableName: this.saveForm.tableName,
                },
                fn: json => {
                    this.loadGenColumnsLoading = false;
                    if (!json.data.status) {
                        json.data.status = '1';
                    }
                    if(this.saveForm.id){
                        json.data.id = this.saveForm.id;
                    }
                    if(this.saveForm.moduleName){
                        json.data.moduleName = this.saveForm.moduleName;
                    }

                    json.data.projectId = this.saveForm.projectId;
                    this.saveForm = json.data;
                    // this.saveForm.genTableColumns = json.data.genTableColumns;

                    this.$nextTick(() => {
                        this.setSort()
                    });

                    this.tableExtraOptions();

                    if (data.status == 'warningTip' && data.message) {
                        this.$alert(data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            dangerouslyUseHTMLString: true,
                            callback: action => {
                                // this.$message({
                                //     type: 'info',
                                //     message: `action: ${action}`
                                // });
                            }
                        });
                    }
                },
                errFn: () => {
                    this.loadGenColumnsLoading = false;
                }
            });
        },
        saveData() {
            this.saveLoading = true;
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$$api_lcdp_saveGenConfig({
                        data: this.saveForm,
                        fn: json => {
                            this.saveLoading = false;
                            this.back();
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
        editData() {
            this.$$api_lcdp_genConfigDetail({
                data: {
                    tableId: this.saveForm.id,
                },
                fn: json => {
                    this.saveForm = json.data;
                    this.$nextTick(() => {
                        this.setSort()
                    });
                    this.tableExtraOptions();

                    if (data.status == 'warningTip' && data.message) {
                        this.$alert(data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            dangerouslyUseHTMLString: true,
                            callback: action => {
                                // this.$message({
                                //     type: 'info',
                                //     message: `action: ${action}`
                                // });
                            }
                        });
                    }
                },
            });
            this.dialogVisible = true;
            this.dialogTitle = 'Edit';
        },
        tableExtraOptions() {
            this.$$api_lcdp_tableExtraOptions({
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
                let lastSelectedValue = this.getLastSelectedValue(lastOptions, latestOptions[i].name);
                if (lastSelectedValue) {
                    latestOptions[i].selectedValue = lastSelectedValue;
                } else { // Default to first
                    latestOptions[i].selectedValue = latestOptions[i].values[0];
                }
            }
        },
        getLastSelectedValue(lastOptions, name) {
            for (let i in lastOptions) {
                if (lastOptions[i].name == name) {
                    return lastOptions[i].selectedValue;
                }
            }
            return null;
        },
        // 获取列表数据
        allDictType() {
            this.$$api_iam_allDictType({
                data: {},
                fn: json => {
                    this.dictTypes = json.data.list;
                }
            })
        },
        // 获取AttrTypes
        getAttrTypes() {
            this.$$api_lcdp_getAttrTypes({
                data: { projectId: this.saveForm.projectId },
                fn: json => {
                    this.attrTypes = json.data;
                }
            })
        },
        getSimpleAttrType: function (attrType) {
            let i = attrType.lastIndexOf('.');
            if (i >= 0) {
                return attrType.substring(i + 1);
            } else {
                return attrType;
            }
        },
        back() {
            // this.$router.push({ path: '/dts/codegen/project/table', query: { id: this.saveForm.projectId } })
            history.back(-1);
        },
    }
}
