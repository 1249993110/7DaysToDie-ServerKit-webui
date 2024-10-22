<template>
    <ProTable
        ref="proTableRef"
        :toolbar="toolbar"
        v-model:size="globalStore.tableSize"
        :btn-label-visible="!globalStore.isSmallScreen"
        v-bind="$attrs"
        @add-click="handleAdd"
        @edit-click="handleEdit"
        @deleteClick="handleDelete"
        @batchDeleteClick="handleBatchDelete"
    />
    <MyFormDialog
        ref="addOrEditRef"
        :title="addOrEditDialogTitle"
        :fields="addOrEditFormFields"
        :form-model="addOrEditFormModel"
        :request="addOrEditRequest"
        @submit="proTableRef.getTableData()"
    />
</template>

<script setup>
const props = defineProps({
    toolbar: {
        type: Object,
    },
    modelName: {
        type: String,
        default: '',
    },
    formFields: {
        type: Array,
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
const addOrEditRef = ref(null);

const isAdd = ref(false);
const addOrEditFormModel = reactive({});
const addOrEditDialogTitle = computed(() => (isAdd.value ? t('global.button.add') : t('global.button.edit')) + ' ' + props.modelName);
const addOrEditRequest = async () => {
    isAdd.value ? await props.requestAdd(addOrEditFormModel) : await props.requestEdit(addOrEditFormModel);
};

const addOrEditFormFields = reactive([...props.formFields]);
watch(isAdd, (val) => {
    if (props.disableIdOnEdit) {
        const field = addOrEditFormFields.find((item) => item.name === proTableRef.value.rowKey);
        if (field) {
            field.props.disabled = !val;
        }
    }
});

const handleAdd = () => {
    isAdd.value = true;
    addOrEditRef.value.open();
};

const toolbar = computed(() => {
    const toolbar = props.toolbar;
    const item = toolbar?.batchOperationItems?.find((item) => item.type === 'export');
    if (item) {
        item.label ??= `${t('global.button.export')} csv`;
        item.onClick ??= async () => {
            const columns = {};
            proTableRef.value.columns.forEach((i) => {
                if (i.prop) {
                    columns[i.prop] = t(toolbar.exportLocaleKeyPrefix + '.' + i.prop) ?? i.prop;
                }
            });

            let data = await proTableRef.value.requestGet({ ...proTableRef.value.requestGetParams, pageSize: -1 });
            data = Array.isArray(data.items) ? data.items : data;

            exportCsv(data, toolbar.exportFileName, columns);
        };
    }

    return toolbar;
});

const handleEdit = (row) => {
    Object.assign(addOrEditFormModel, row);
    isAdd.value = false;
    addOrEditRef.value.open(row);
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
</script>
