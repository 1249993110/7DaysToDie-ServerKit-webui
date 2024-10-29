<template>
    <div>
        <RouterButton :names="['listManagement.itemList', 'listManagement.commandList']" />
        <MyTable
            row-key="id"
            :columns="columns"
            :model-name="t('menus.listManagement.itemList')"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
            ref="myTableRef"
        />
    </div>
</template>

<script>
export default {
    name: 'listManagement.itemList',
};
</script>

<script setup>
import * as api from '~/api/item-list.js';
import GameIcon from '~/components/GameIcon/index.vue';

const { t, tm, rt } = useI18n();
const myTableRef = ref(null);

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        prop: 'id',
        label: t('views.listManagement.tableHeader.id'),
        width: 80,
        align: 'center',
        fixed: true,
    },
    {
        prop: 'icon',
        label: t('views.listManagement.tableHeader.icon'),
        width: 72,
        render: ({ row }) => h(GameIcon, { name: row.itemName, size: 40 }),
        className: 'table-icon-col',
    },
    {
        prop: 'itemName',
        label: t('views.listManagement.tableHeader.itemName'),
        width: 150,
        tag: true,
    },
    {
        prop: 'count',
        label: t('views.listManagement.tableHeader.count'),
        width: 80,
    },
    {
        prop: 'quality',
        label: t('views.listManagement.tableHeader.quality'),
        width: 80,
    },
    {
        prop: 'durability',
        label: t('views.listManagement.tableHeader.durability'),
        width: 100,
    },
    {
        prop: 'createdAt',
        label: t('views.listManagement.tableHeader.createdAt'),
        width: 160,
    },
    {
        prop: 'description',
        label: t('views.listManagement.tableHeader.description'),
        minWidth: 150,
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: t('menus.listManagement.itemList'),
            // divided: true,
        },
    ],
}));

const search = computed(() => ({
    fields: [
        {
            type: 'input',
            name: 'keyword',
            label: t('global.keyword'),
            props: {
                autofocus: true,
            },
        },
    ],
}));

const addEditFormFields = computed(() => [
    {
        type: 'ItemBlockSelector',
        name: 'itemName',
        label: t('views.listManagement.tableHeader.itemName'),
        required: true,
        props: {
            onSelect: (row) => {
                myTableRef.value.addEditFormModel.description = row.localizationName;
            },
        },
    },
    {
        type: 'input-number',
        name: 'count',
        label: t('views.listManagement.tableHeader.count'),
        required: true,
        default: 1,
        props: {
            min: 1,
            max: 1000000,
        },
    },
    {
        type: 'input-number',
        name: 'quality',
        label: t('views.listManagement.tableHeader.quality'),
        default: 1,
        props: {
            min: 0,
        },
    },
    {
        type: 'input-number',
        name: 'durability',
        label: t('views.listManagement.tableHeader.durability'),
        default: 100,
        props: {
            min: 0,
            max: 100,
        },
    },
    {
        type: 'input',
        name: 'description',
        label: t('views.listManagement.tableHeader.description'),
    },
]);

const requestGet = async (params) => {
    const data = await api.getItemListPaged({
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        keyword: params.keyword,
        // order: params.sortPorp,
        // desc: params.sortOrder === 'descending',
    });

    return data;
};

const requestAdd = async (formModel) => {
    await api.addItem(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateItem(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteItemById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteItemByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};
</script>
