<template>
    <div class="pro-table">
        <el-card class="search-card" v-loading="loading" shadow="always" v-if="search" v-show="searchVisible">
            <slot name="search">
                <ProForm ref="searchRef" :request="getTableData" label-position="right" :model="searchModel" v-bind="search">
                    <template #btnGroup v-if="$slots.btnGroup">
                        <slot name="btnGroup"></slot>
                    </template>
                </ProForm>
            </slot>
        </el-card>
        <el-card class="table-card" v-loading="loading" shadow="always">
            <slot name="toolbar" :selected-rows="selectedRows" :selected-ids="selectedIds" :is-selected="isSelected">
                <Toolbar
                    v-if="toolbar"
                    v-bind="toolbar"
                    :btn-label-visible="btnLabelVisible"
                    :selectedIds="selectedIds"
                    :selectedRows="selectedRows"
                    :is-selected="isSelected"
                    @add-click="handleAdd"
                    @batch-delete-click="handleBatchDelete"
                    @batch-operation-command="handleBatchOperationCommand"
                    @refresh-click="getTableData"
                    @setting-click="handleOpenColSetting"
                    @search-click="searchVisible = !searchVisible"
                />
            </slot>
            <el-table
                stripe
                show-overflow-tooltip
                border
                v-bind="$attrs"
                ref="tableRef"
                :size="tableSize"
                :data="tableData"
                :row-key="rowKey"
                :default-sort="defaultSort"
                @selection-change="handleSelectionChange"
                @sort-change="handleSortChange"
            >
                <slot />
                <template v-for="item in columns.filter((i) => i.visible)" :key="item.type ?? item.prop">
                    <!-- selection || index || expand || operation-->
                    <el-table-column v-if="item.type && columnTypes.includes(item.type)" v-bind="item">
                        <template #default="scope">
                            <!-- expand -->
                            <template v-if="item.type === 'expand'">
                                <component v-if="item.render" :is="item.render" v-bind="scope" />
                                <slot v-else :name="item.type" v-bind="scope" />
                            </template>
                            <template v-if="item.type === 'operation'">
                                <component v-if="item.render" :is="item.render" v-bind="scope" />
                                <slot v-else :name="item.type" v-bind="scope">
                                    <el-button v-if="item.editBtnVisible" size="small" type="primary" :icon="Edit" @click="handleEdit(scope)">
                                        <template #default v-if="btnLabelVisible">{{ t('global.button.edit') }}</template>
                                    </el-button>
                                    <el-button v-if="item.deleteBtnVisible" size="small" type="danger" :icon="Delete" @click="handleDelete(scope)">
                                        <template #default v-if="btnLabelVisible">{{ t('global.button.delete') }}</template>
                                    </el-button>
                                </slot>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column v-else v-bind="item">
                        <template #header="scope" v-if="item.headerRender">
                            <component v-if="item.headerRender" :is="item.headerRender" v-bind="scope" />
                            <slot v-else-if="item.prop && $slots[`${item.prop}Header`]" :name="`${item.prop}Header`" v-bind="scope" />
                            <span v-else>{{ item.label ?? '' }}</span>
                        </template>
                        <template #default="scope">
                            <component v-if="item.render" :is="item.render" v-bind="scope" />
                            <slot v-else-if="item.prop && $slots[`${item.prop}Cell`]" :name="`${item.prop}Cell`" v-bind="scope" />
                            <el-tag v-else-if="item.tag" :type="item.tagType">{{ defaultRenderCell(item, scope) }}</el-tag>
                            <span v-else>{{ defaultRenderCell(item, scope) }}</span>
                        </template>
                    </el-table-column>
                </template>
                <template #append v-if="$slots.append">
                    <slot name="append" />
                </template>
                <template #empty v-if="$slots.empty">
                    <slot name="empty" />
                </template>
            </el-table>
            <slot name="footer">
                <div class="footer">
                    <el-radio-group v-model="tableSize">
                        <el-radio value="small" size="small">{{ t('components.proTable.radio.small') }}</el-radio>
                        <el-radio value="default" size="default">{{ t('components.proTable.radio.medium') }}</el-radio>
                        <el-radio value="large" size="large">{{ t('components.proTable.radio.large') }}</el-radio>
                    </el-radio-group>
                    <el-pagination
                        v-if="pagination"
                        background
                        :page-sizes="[5, 10, 20, 50, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :size="tableSize"
                        @size-change="handlePaginationChange"
                        @current-change="handlePaginationChange"
                        :total="paginationModel.total"
                        v-model:current-page="paginationModel.pageNumber"
                        v-model:page-size="paginationModel.pageSize"
                    >
                    </el-pagination>
                </div>
            </slot>
        </el-card>
        <ColSetting :columns="columns" ref="colSettingRef" v-if="toolbar" />
    </div>
</template>

<script setup>
import { Edit, Delete } from '@element-plus/icons-vue';
import ColSetting from './ColSetting.vue';
import Toolbar from './Toolbar.vue';

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    rowKey: {
        type: String,
        default: 'id',
    },
    defaultSort: {
        type: Object,
    },
    size: {
        type: String,
        default: 'defalut',
    },
    request: {
        type: Function,
    },
    search: {
        type: [Boolean, Object],
        default: true,
    },
    toolbar: {
        type: [Boolean, Object],
        default: true,
    },
    pagination: {
        type: [Boolean, Object],
        default: {
            defaultSize: 20,
        },
    },
    btnLabelVisible: {
        type: Boolean,
        default: true,
    },
    autoAdjustColumnWidth: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['addClick', 'batchDeleteClick', 'batchOperationCommand', 'editClick', 'deleteClick', 'update:size', 'update:pagination', 'dataLoaded']);

const { t } = useI18n();

const loading = ref(false);

const searchRef = ref(null);
const searchVisible = ref(props.search?.visible ?? true);

const tableRef = ref(null);
const tableData = ref([]);
const columnTypes = ['selection', 'index', 'expand', 'operation'];

const searchModel = reactive({});
const sortModel = reactive({
    sortPorp: props.defaultSort?.prop,
    sortOrder: props.defaultSort?.order,
});
const paginationModel = reactive({
    pageNumber: 1,
    pageSize: props.pagination.defaultSize ?? 20,
    total: 0,
});
const requestParams = computed(() => ({
    ...paginationModel,
    ...searchModel,
    ...sortModel,
}));

const getTableData = async () => {
    loading.value = true;
    try {
        const data = await Promise.resolve(props.request(requestParams.value));
        tableData.value = Array.isArray(data.items) ? data.items : data;
        paginationModel.total = data.total ?? 0;
        emit('dataLoaded', tableData.value);
    } finally {
        loading.value = false;
    }
};

getTableData();

const handlePaginationChange = async () => {
    await getTableData();
};

const defaultRenderCell = (item, scope) => {
    if (item.formatter) {
        return item.formatter(scope.row, scope.column);
    }

    return scope.row[item.prop] ?? '';
};

const isSelected = ref(false);
const selectedRows = ref([]);
const selectedIds = computed(() => selectedRows.value.map((item) => item[props.rowKey]));
const handleSelectionChange = (val) => {
    selectedRows.value = val;
    isSelected.value = val.length !== 0;
};

const handleSortChange = async ({ prop, order }) => {
    sortModel.sortPorp = prop;
    sortModel.sortOrder = order;
    await getTableData();
};

const handleAdd = () => {
    emit('addClick');
};

const handleBatchDelete = () => {
    emit('batchDeleteClick', selectedIds.value, selectedRows.value);
};

const handleBatchOperationCommand = (command) => {
    emit('batchOperationCommand', command, selectedIds.value, selectedRows.value);
};

const columns = reactive([]);
watch(
    () => props.columns,
    (val) => {
        columns.length = 0;
        columns.push(...val);

        columns.forEach((item) => {
            if (item.type === 'selection') {
                item.fixed ??= 'left';
                item.width ??= 50;
                item.label ??= '\u2610';
                item.reserveSelection ??= true;
                item.align ??= 'center';
                item.showOverflowTooltip ??= false;
            } else if (item.type === 'index') {
                item.fixed ??= 'left';
                item.width ??= 70;
                item.label ??= t('components.proTable.tableHeader.index');
                item.align ??= 'center';
                item.showOverflowTooltip ??= false;
            } else if (item.type === 'expand') {
                // item.fixed ??= 'left';
                item.align ??= 'center';
                item.showOverflowTooltip ??= false;
            } else if (item.type === 'operation') {
                item.fixed ??= 'right';
                item.minWidth ??= 120;
                // item.width ??= 180;
                item.label ??= t('components.proTable.tableHeader.operate');
                item.align ??= 'center';
                item.showOverflowTooltip ??= false;
                item.editBtnVisible ??= true;
                item.deleteBtnVisible ??= true;
            }

            item.visible ??= true;
        });
    },
    {
        immediate: true,
    }
);

const colSettingRef = ref(null);
const handleOpenColSetting = () => {
    colSettingRef.value.open();
};

const handleEdit = (scope) => {
    emit('editClick', scope.row);
};

const handleDelete = async (scope) => {
    emit('deleteClick', scope.row[props.rowKey], scope.row);
};

const tableSize = useVModel(props, 'size', emit);

defineExpose({
    loading: loading,
    columns: columns,
    columnTypes: columnTypes,
    tableData: tableData,
    tableRef: tableRef,
    request: props.request,
    requestParams: requestParams,
    refresh: getTableData,
});

const tableSizeMap = {
    small: 0,
    default: 1,
    large: 2,
};

watch(tableSize, (newVal, oldVal) => {
    if (!props.autoAdjustColumnWidth) {
        return;
    }

    let delta = tableSizeMap[newVal] - tableSizeMap[oldVal];
    if (delta == 0) {
        return;
    }

    delta = delta * 12;

    for (let i = 0; i < columns.length; i++) {
        const item = columns[i];
        if (item.width) {
            item.width += delta;
        }
        if (item.minWidth) {
            item.minWidth += delta;
        }
    }
});
</script>

<style scoped lang="scss">
.pro-table {
    height: calc(100vh - 140px);
    display: flex;
    flex-direction: column;

    .search-card {
        margin-top: 20px;
        background-color: #ffffffaf;
        overflow: unset;
        padding-bottom: 2px;
    }
    .table-card {
        flex-grow: 1;
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            display: flex;
            flex-direction: column;
            height: calc(100% - 40px);
        }
        .el-table {
            flex-grow: 1;
        }
        .footer {
            display: flex;
            margin-top: 16px;
            .el-pagination {
                margin-left: auto;
            }
        }
    }
}
</style>
