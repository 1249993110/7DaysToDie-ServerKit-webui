<template>
    <div class="my-table">
        <el-card class="search-card" shadow="always" v-loading="loading" v-if="showSearcher">
            <el-form ref="searchFormRef" :model="searchFormModel" label-position="right" :inline="true">
                <slot name="searchFormItems"></slot>
                <el-form-item>
                    <el-button :icon="Search" @click="handleSearch" type="primary">查 询</el-button>
                    <el-button :icon="Refresh" @click="handleReset">重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="table-card" shadow="always" v-loading="loading">
            <div class="toolbar">
                <slot name="toolbar"></slot>
                <el-button v-if="showAddBtn" type="primary" :icon="Plus" @click="handleAdd">新 增</el-button>
                <el-button v-if="showBatchDeleteBtn" type="danger" :icon="Delete" @click="handleBatchDelete" :disabled="batchDeleteDisabled">{{ batchDeleteLabel }}</el-button>
                <slot name="toolbarPost"></slot>
                <div style="margin-left: auto">
                    <el-button v-if="showImportBtn" style="margin-right: 12px" type="primary" :icon="UploadFilled" @click="handleImport">导 入</el-button>
                    <el-dropdown v-if="showExportBtn" @command="handleExportCommand">
                        <el-button type="success">
                            导 出<el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="csv">导出为csv</el-dropdown-item>
                                <el-dropdown-item command="json">导出为json</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="table">
                <el-table
                    height="100%"
                    ref="tableRef"
                    :data="tableData"
                    highlight-current-row
                    stripe
                    @selection-change="handleSelectionChange"
                    @row-contextmenu="handleContextmenu"
                >
                    <el-table-column v-if="showTableSelection" type="selection" width="50" align="center" />
                    <el-table-column v-if="showTableIndex" type="index" label="序号" width="60" />
                    <slot name="columns"></slot>
                    <el-table-column v-if="showOperationColumn" label="操作" :width="operationColumnWidth" header-align="center" show-overflow-tooltip fixed="right">
                        <template #default="{ row }">
                            <el-button v-if="showEditBtn" size="small" type="primary" :icon="Edit" @click="handleEdit(row)">{{ editLabel }}</el-button>
                            <el-button v-if="showDeleteBtn" size="small" type="danger" :icon="Delete" @click="handleDelete(row)">{{ deleteLabel }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pager" v-if="showPager">
                <el-pagination
                    style="margin-top: 8px"
                    background
                    @size-change="handlePaginationChange"
                    @current-change="handlePaginationChange"
                    :page-sizes="[5, 10, 20, 50, 100]"
                    v-model:current-page="pagination.pageNumber"
                    v-model:page-size="pagination.pageSize"
                    :total="total"
                    layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
            </div>
        </el-card>
        <component
            v-if="showAddBtn"
            :is="addOrEditComponent"
            :initData="initData"
            :isAdd="isAdd"
            v-model="addOrEditComponentVisible"
            @onConfirm="handleAddOrEditConfirm"
        ></component>
    </div>
</template>

<script setup>
import { Edit, Plus, Delete, Refresh, Search, UploadFilled, ArrowDown } from '@element-plus/icons-vue';
import myconfirm from '~/utils/myconfirm';

const props = defineProps({
    showSearcher: {
        type: Boolean,
        default: true,
    },
    searchFormModel: {
        type: Object,
    },
    getData: {
        type: Function,
    },
    delete: {
        type: Function,
    },
    editLabel: {
        type: String,
        default: '编辑',
    },
    deleteLabel: {
        type: String,
        default: '删除',
    },
    batchDelete: {
        type: Function,
    },
    batchDeleteLabel: {
        type: String,
        default: '批量删除',
    },
    showToolbar: {
        type: Boolean,
        default: true,
    },
    showPager: {
        type: Boolean,
        default: true,
    },
    showOperationColumn: {
        type: Boolean,
        default: true,
    },
    operationColumnWidth: {
        type: [String, Number],
        default: 180,
    },
    showAddBtn: {
        type: Boolean,
        default: true,
    },
    showEditBtn: {
        type: Boolean,
        default: true,
    },
    showDeleteBtn: {
        type: Boolean,
        default: true,
    },
    showBatchDeleteBtn: {
        type: Boolean,
        default: true,
    },
    showImportBtn: {
        type: Boolean,
        default: false,
    },
    showExportBtn: {
        type: Boolean,
        default: true,
    },
    showTableSelection: {
        type: Boolean,
        default: true,
    },
    showTableIndex: {
        type: Boolean,
        default: true,
    },
    addOrEditComponent: {
        type: Object,
    },
    addOrEditComponentProps: {
        type: Object,
    },
    tableData: {
        type: Array,
    },
    total: {
        type: Number,
        default: 0,
    },
});

const loading = ref(false);

const pagination = reactive({
    pageNumber: 1,
    pageSize: 20,
});

const getData = async () => {
    loading.value = true;
    try {
        await Promise.resolve(props.getData(pagination));
    } catch (error) {
    } finally {
        loading.value = false;
    }
};
getData();

const handleSearch = async () => {
    await getData();
};

const searchFormRef = ref();
const handleReset = () => {
    searchFormRef.value.resetFields();
};

const batchDeleteDisabled = ref(true);
let multipleSelection = [];
const handleSelectionChange = (val) => {
    multipleSelection = val;
    batchDeleteDisabled.value = multipleSelection.length === 0;
};

const initData = ref({});
const isAdd = ref(false);
const addOrEditComponentVisible = ref(false);
const handleAdd = () => {
    isAdd.value = true;
    initData.value = { ...props.addOrEditComponentProps };
    addOrEditComponentVisible.value = true;
};
const handleEdit = (row) => {
    isAdd.value = false;
    initData.value = { ...props.addOrEditComponentProps, ...row };
    addOrEditComponentVisible.value = true;
};

const handleDelete = async (row) => {
    try {
        if (await myconfirm('确定删除选中的内容吗?')) {
            await Promise.resolve(props.delete(row));
            await getData();
        }
    } catch {}
};

const handleBatchDelete = async () => {
    try {
        if (await myconfirm('确定删除选中的内容吗?')) {
            await Promise.resolve(props.batchDelete(multipleSelection));
            await getData();
        }
    } catch {}
};

const handlePaginationChange = async () => {
    await getData();
};

const handleAddOrEditConfirm = async () => {
    await getData();
};

const emit = defineEmits(['onExport', 'onImport', 'onContextmenu']);
const handleExportCommand = async (command) => {
    emit('onExport', command);
};

const handleImport = () => {
    emit('onImport');
};

const tableRef = ref();

const handleContextmenu = (row, column, event) => {
    event.preventDefault();
    tableRef.value.setCurrentRow(row);
    emit('onContextmenu', row, column, event);
};

defineExpose({ tableRef });

const tableHeight = computed(() => {
    if (props.showPager) {
        return 'calc(100% - 92px)';
    } else {
        return 'calc(100% - 32px)';
    }
});
</script>

<style scoped lang="scss">
.my-table {
    height: calc(100vh - 160px);
    display: flex;
    flex-direction: column;
    .search-card {
        :deep(.el-card__body) {
            padding-bottom: 2px;
        }
        background-color: #ffffffaf;
        margin-bottom: 20px;
    }

    .table-card {
        flex: 1;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
        }

        .toolbar {
            display: flex;
            margin-bottom: 20px;
        }
        .table {
            height: v-bind(tableHeight);
            :deep(.el-table) {
                background-color: transparent;
            }
        }
        .pager {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
