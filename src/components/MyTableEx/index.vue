<template>
    <div class="pro-table">
        <el-card class="search-card" shadow="always" v-loading="loading" v-if="showSearcher">
            <el-form ref="searchFormRef" :model="searchFormModel" label-position="right" :inline="true">
                <slot name="searchFormItems"></slot>
                <el-form-item>
                    <el-button :icon="Search" @click="handleSearch" type="primary">{{ t('global.button.search') }}</el-button>
                    <el-button :icon="Refresh" @click="handleReset">{{ t('global.button.reset') }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="table-card" shadow="always" v-loading="loading">
            <div class="toolbar">
                <slot name="toolbar"></slot>
                <el-button v-if="showAddBtn" type="primary" :icon="Plus" @click="handleAdd">{{ t('global.button.add') }}</el-button>
                <el-button v-if="showBatchDeleteBtn" type="danger" :icon="Delete" @click="handleBatchDelete" :disabled="batchDeleteDisabled">{{ batchDeleteLabel }}</el-button>
                <slot name="toolbarPost"></slot>
                <div style="margin-left: auto">
                    <el-button v-if="showImportBtn" style="margin-right: 12px" type="primary" :icon="UploadFilled" @click="handleImport">{{ t('global.button.import') }}</el-button>
                    <el-dropdown v-if="showExportBtn" @command="handleExportCommand">
                        <el-button type="success">
                            {{ t('global.button.export') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="csv">{{ t('global.button.export') }} csv</el-dropdown-item>
                                <el-dropdown-item command="json">{{ t('global.button.export') }} json</el-dropdown-item>
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
                    @sort-change="handleSortChange"
                    :default-sort="defaultSort"
                    :size="tableSize"
                >
                    <el-table-column v-if="showTableSelection" type="selection" width="50" align="center" />
                    <el-table-column v-if="showTableIndex" type="index" :label="t('components.proTable.tableHeader.index')" width="64" />
                    <slot name="columns"></slot>
                    <el-table-column v-if="showOperationColumn" :label="t('components.proTable.tableHeader.operate')" :width="operationColumnWidth" header-align="center" show-overflow-tooltip fixed="right">
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
import { i18n } from '~/plugins/i18n';
const { t } = i18n.global;

const props = defineProps({
    tableSize: {
        type: String,
        default: 'default',
    },
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
        default: i18n.global.t('global.button.edit'),
    },
    deleteLabel: {
        type: String,
        default: i18n.global.t('global.button.delete'),
    },
    batchDelete: {
        type: Function,
    },
    batchDeleteLabel: {
        type: String,
        default: i18n.global.t('global.button.batchDelete'),
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
    pageSize: {
        type: Number,
        default: 20,
    },
    cardBodyPadding: {
        type: String,
        default: '20px',
    },
    defaultSort: {
        type: Object,
    },
});

const loading = ref(false);

const pagination = reactive({
    pageNumber: 1,
    pageSize: props.pageSize,
});

const getData = async () => {
    loading.value = true;
    try {
        await Promise.resolve(props.getData(pagination));
    } catch (error) {
        console.log(error);
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
        if (await myconfirm(t('global.message.deleteConfirm'))) {
            await Promise.resolve(props.delete(row));
            await getData();
            ElMessage.success(t('global.message.deleteSuccess'));
        }
    } catch {
        ElMessage.error(t('global.message.deleteFailed'));
    }
};

const handleBatchDelete = async () => {
    try {
        if (await myconfirm(t('global.message.deleteConfirm'))) {
            await Promise.resolve(props.batchDelete(multipleSelection));
            await getData();
            ElMessage.success(t('global.message.deleteSuccess'));
        }
    } catch {
        ElMessage.error(t('global.message.deleteFailed'));
    }
};

const handlePaginationChange = async () => {
    await getData();
};

const handleAddOrEditConfirm = async () => {
    await getData();
};

const emit = defineEmits(['onExport', 'onImport', 'onContextmenu', 'onSortChange']);
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

const handleSortChange = async ({ prop, order }) => {
    emit('onSortChange', { prop, order });
    await getData();
};
</script>

<style scoped lang="scss">
.pro-table {
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
        flex-grow: 1;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            height: calc(100% - 40px);
            padding: v-bind(cardBodyPadding);
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
