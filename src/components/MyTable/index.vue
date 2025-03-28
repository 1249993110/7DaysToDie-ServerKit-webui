<template>
    <ProTable
        ref="proTableRef"
        :row-key="rowKey"
        :search="search"
        :toolbar="toolbar"
        v-model:size="globalStore.tableSize"
        :btn-label-visible="!globalStore.isSmallScreen"
        :request="request.get"
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
        ref="addEditDialogRef"
        :title="addEditDialogTitle"
        :fields="addEditFormFields"
        :form-model="addEditFormModel"
        :request="addEditRequest"
        @submit="refresh"
        :label-width="addEditLabelWidth"
        :rules="addEditFormRules"
    />
</template>

<script setup>
import { Search, Refresh } from '@element-plus/icons-vue';
import customComponents from '~/utils/customComponents';

const props = defineProps({
    rowKey: {
        type: String,
        default: 'id',
    },
    search: {
        type: [Boolean, Object],
        default: true,
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
    addEditFormRules: {
        type: Object,
        default: () => ({}),
    },
    addEditLabelWidth: {
        type: [String, Number],
        default: 120,
    },
    request: {
        type: Object,
        required: true,
        default: {
            get: null,
            add: null,
            edit: null,
            delete: null,
            batchDelete: null,
        },
    },
    disableOnEditFields: {
        type: Array,
    },
});

const { t } = useI18n();
const globalStore = useGlobalStore();

const proTableRef = ref(null);
const addEditDialogRef = ref(null);

const search = computed(() => {
    return Object.assign(
        {
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
            customComponents: customComponents,
        },
        props.search
    );
});

const isAdd = ref(false);
const addEditFormModel = reactive({});
const addEditDialogTitle = computed(() => (isAdd.value ? t('global.button.add') : t('global.button.edit')) + ' ' + props.modelName);
const addEditRequest = async () => {
    isAdd.value ? await props.request.add(addEditFormModel) : await props.request.edit(addEditFormModel);
};

const addEditFormFields = computed(() => {
    const result = props.addEditFormFields;

    let disableOnEditFields = [];
    if(!props.disableOnEditFields){
        disableOnEditFields.push(props.rowKey);
    }else{
        disableOnEditFields = props.disableOnEditFields;
    }

    for(let i = 0; i < result.length; i++){
        if(disableOnEditFields.includes(result[i].name)){
            result[i].props ??= {};
            result[i].props.disabled = !isAdd.value;
        }
    }

    return result;
});

const handleAdd = () => {
    isAdd.value = true;
    addEditDialogRef.value.open();
};

const toolbar = computed(() => {
    const toolbar = props.toolbar;
    const item = toolbar?.batchOperationItems?.find((item) => item.type === 'export');
    if (item) {
        item.label ??= `${t('global.button.export')} csv`;
        item.onClick ??= async () => {
            const columns = {};
            const formatters = {};

            let data = await props.request.get({ ...proTableRef.value.requestParams, pageSize: -1 });
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

const handleEdit = async (row) => {
    isAdd.value = false;
    addEditDialogRef.value.open();
    await nextTick();
    Object.assign(addEditFormModel, row);
};

const handleDelete = async (id, row) => {
    try {
        if (await myconfirm(t('global.message.deleteConfirm'))) {
            proTableRef.value.loading = true;
            await Promise.resolve(props.request.delete(id, row));
            await refresh();
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
            await Promise.resolve(props.request.batchDelete(selectedIds, selectedRows));
            await refresh();
            ElMessage.success(t('global.message.deleteSuccess'));
        }
    } catch (error) {
        console.error(error);
        ElMessage.error(t('global.message.deleteFailed'));
    } finally {
        proTableRef.value.loading = false;
    }
};

const refresh = async () => {
    await proTableRef.value?.refresh();
};

defineExpose({
    getTableRef: () => proTableRef.value.tableRef,
    refresh,
    addEditFormModel: addEditFormModel,
});
</script>
