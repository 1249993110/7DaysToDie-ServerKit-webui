<template>
    <ProTable
        ref="proTableRef"
        :row-key="rowKey"
        :search="search"
        :toolbar="toolbar"
        v-model:size="globalStore.tableSize"
        :btn-label-visible="!globalStore.isSmallScreen"
        v-bind="$attrs"
        @add-click="handleAdd"
        @edit-click="handleEdit"
        @deleteClick="handleDelete"
        @batchDeleteClick="handleBatchDelete"
    >
        <template #[slot]="scope" v-for="slot in Object.keys($slots)">
            <slot :name="slot" v-bind="scope" />
        </template>
    </ProTable>
    <MyFormDialog
        ref="addEditRef"
        :title="addEditDialogTitle"
        :fields="addEditFormFields"
        :form-model="addOrEditFormModel"
        :request="addOrEditRequest"
        @submit="proTableRef.getTableData()"
    />
</template>

<script setup>
import { Search, Refresh } from '@element-plus/icons-vue';

const props = defineProps({
    rowKey: {
        type: String,
        default: 'id',
    },
    searchFormFields: {
        type: Array,
    },
    toolbar: {
        type: Object,
    },
    modelName: {
        type: String,
        default: '',
    },
    addEditFormFields: {
        type: Array,
        default: () => [],
    },
    requestAdd: {
        type: Function,
    },
    requestEdit: {
        type: Function,
    },
    requestDelete: {
        type: Function,
    },
    requestBatchDelete: {
        type: Function,
    },
    disableIdOnEdit: {
        type: Boolean,
        default: true,
    },
});

const { t } = useI18n();
const globalStore = useGlobalStore();

const proTableRef = ref(null);
const addEditRef = ref(null);

const search = computed(() => {
    return {
        fields: props.searchFormFields,
        btnGroup: {
            inline: true,
            position: 'left',
            submit: {
                label: t('global.button.search'),
                icon: Search,
            },
            reset: {
                icon: Refresh,
            },
        },
        colSpan: {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 8,
            xl: 6,
        },
    };
});

const isAdd = ref(false);
const addOrEditFormModel = reactive({});
const addEditDialogTitle = computed(() => (isAdd.value ? t('global.button.add') : t('global.button.edit')) + ' ' + props.modelName);
const addOrEditRequest = async () => {
    isAdd.value ? await props.requestAdd(addOrEditFormModel) : await props.requestEdit(addOrEditFormModel);
};

const addEditFormFields = computed(() => {
    const result = props.addEditFormFields;
    if (!props.disableIdOnEdit) {
        return result;
    }

    const field = result.find((item) => item.name === props.rowKey);
    if (!field) {
        return result;
    }

    field.props = field.props ?? {};
    field.props.disabled = !isAdd.value;
    return result;
});

const handleAdd = () => {
    isAdd.value = true;
    addEditRef.value.open();
};

const toolbar = computed(() => {
    const toolbar = props.toolbar;
    const item = toolbar?.batchOperationItems?.find((item) => item.type === 'export');
    if (item) {
        item.label ??= `${t('global.button.export')} csv`;
        item.onClick ??= async () => {
            const columns = {};
            const formatters = {};

            let data = await proTableRef.value.requestGet({ ...proTableRef.value.requestGetParams, pageSize: -1 });
            data = Array.isArray(data.items) ? data.items : data;

            proTableRef.value.columns.forEach((col) => {
                if (col.prop) {
                    columns[col.prop] = col.label;
                    if (col.formatter) {
                        formatters[col.prop] = col.formatter;
                    }
                }
            });

            const array = [];
            for (let i = 0; i < data.length; i++) {
                const obj = {};
                for (const key in columns) {
                    const formatter = formatters[key];
                    if (formatter) {
                        obj[key] = formatter(data[i]);
                    } else {
                        obj[key] = data[i][key];
                    }
                }
                array.push(obj);
            }

            exportCsv(array, item.fileName, columns);
        };
    }

    return toolbar;
});

const handleEdit = (row) => {
    Object.assign(addOrEditFormModel, row);
    isAdd.value = false;
    addEditRef.value.open(row);
};

const handleDelete = async (id, row) => {
    try {
        if (await myconfirm(t('global.message.deleteConfirm'))) {
            proTableRef.value.loading = true;
            await Promise.resolve(props.requestDelete(id, row));
            await proTableRef.value.getTableData();
            ElMessage.success(t('global.message.deleteSuccess'));
        }
    } catch (error) {
        console.error(error);
        ElMessage.error(t('global.message.deleteFailed'));
    } finally {
        proTableRef.value.loading = false;
    }
};

const handleBatchDelete = async (selectedIds, selectedRows) => {
    try {
        if (await myconfirm(t('global.message.deleteConfirm'))) {
            proTableRef.value.loading = true;
            await Promise.resolve(props.requestBatchDelete(selectedIds, selectedRows));
            await proTableRef.value.getTableData();
            ElMessage.success(t('global.message.deleteSuccess'));
        }
    } catch (error) {
        console.error(error);
        ElMessage.error(t('global.message.deleteFailed'));
    } finally {
        proTableRef.value.loading = false;
    }
};

defineExpose({
    getTableRef: () => proTableRef.value.tableRef,
});
</script>
