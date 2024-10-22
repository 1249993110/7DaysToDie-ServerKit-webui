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
    ></ProTable>
    <AddOrEdit ref="addOrEditRef" v-bind="$attrs" @submit="proTableRef.getTableData()" />
</template>

<script setup>
import AddOrEdit from './AddOrEdit.vue';

const props = defineProps({
    toolbar: {
        type: Object,
    },
    requestDelete: {
        type: Function,
    },
    requestBatchDelete: {
        type: Function,
    },
});

const { t } = useI18n();
const globalStore = useGlobalStore();

const proTableRef = ref(null);
const addOrEditRef = ref(null);

const handleAdd = () => {
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
    addOrEditRef.value.open(row);
};

const handleDelete = async (row) => {
    try {
        if (await myconfirm(t('global.message.deleteConfirm'))) {
            await Promise.resolve(props.requestDelete(row));
            await proTableRef.value.getTableData();
            ElMessage.success(t('global.message.deleteSuccess'));
        }
    } catch (e) {
        console.error(e);
        ElMessage.error(t('global.message.deleteFailed'));
    }
};

const handleBatchDelete = async (selectedIds, selectedRows) => {
    try {
        if (await myconfirm(t('global.message.deleteConfirm'))) {
            await Promise.resolve(props.requestBatchDelete(selectedIds, selectedRows));
            await proTableRef.value.getTableData();
            ElMessage.success(t('global.message.deleteSuccess'));
        }
    } catch (e) {
        console.error(e);
        ElMessage.error(t('global.message.deleteFailed'));
    }
};
</script>
