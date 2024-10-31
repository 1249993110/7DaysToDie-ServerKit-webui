<template>
    <div>
        <RouterButton :names="['gameStore.settings', 'gameStore.management']" />
        <MyTable
            row-key="id"
            :columns="columns"
            :model-name="rt(tm('menus.gameStore')[''])"
            :toolbar="toolbar"
            :search="search"
            :add-edit-form-fields="addEditFormFields"
            :request="request"
        >
            <template #bindCell="{ row }">
                <el-button size="small" color="#40e0d0" @click="handleAssociatedItem(row)">{{ t('views.gameStore.tableHeader.bindItem') }}</el-button>
                <el-button size="small" color="#8a2be2" @click="handleAssociatedCommand(row)">{{ t('views.gameStore.tableHeader.bindCmd') }}</el-button>
            </template>
        </MyTable>
        <AssociatedItems v-model="associatedItemsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @edit="handleItemsEdit" />
        <AssociatedCommands v-model="associatedCommandsVisible" v-model:table-data="associatedData" :loading="associatedLoading" @edit="handleCommandsEdit" />
    </div>
</template>

<script>
export default {
    name: 'gameStore.management',
};
</script>

<script setup>
import * as api from '~/api/goods.js';

const { t, tm, rt } = useI18n();

const columns = computed(() => [
    {
        type: 'selection',
    },
    {
        prop: 'id',
        label: t('views.gameStore.tableHeader.id'),
        width: 80,
        sortable: 'custom',
    },
    {
        prop: 'name',
        label: t('views.gameStore.tableHeader.name'),
        minWidth: 150,
        sortable: 'custom',
        tag: true,
    },
    {
        prop: 'price',
        label: t('views.gameStore.tableHeader.price'),
        width: 120,
        sortable: 'custom',
    },
    {
        prop: 'createdAt',
        label: t('views.gameStore.tableHeader.createdAt'),
        width: 160,
        sortable: 'custom',
    },
    {
        prop: 'description',
        label: t('views.gameStore.tableHeader.description'),
        minWidth: 150,
        sortable: 'custom',
    },
    {
        prop: 'bind',
        label: t('views.gameStore.tableHeader.bind'),
        width: 225,
        headerAlign: 'center',
    },
    {
        type: 'operation',
    },
]);

const toolbar = computed(() => ({
    batchOperationItems: [
        {
            type: 'export',
            fileName: rt(tm('menus.gameStore')['']),
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

const newId = ref(0);
const addEditFormFields = computed(() => [
    {
        type: 'input-number',
        name: 'id',
        label: t('views.gameStore.tableHeader.id'),
        required: true,
        default: newId.value,
    },
    {
        type: 'input',
        name: 'name',
        label: t('views.gameStore.tableHeader.name'),
        required: true,
    },
    {
        type: 'input-number',
        name: 'price',
        label: t('views.gameStore.tableHeader.price'),
        required: true,
        default: 1,
    },
    {
        type: 'input',
        name: 'description',
        label: t('views.gameStore.tableHeader.description'),
        props: {
            type: 'textarea',
        },
    },
]);

const requestGet = async (params) => {
    let data = await api.getGoods();
    if (data.length) {
        newId.value = data[data.length - 1].id + 1;
    }

    data = searchByKeyword(data, params.keyword, ['id', 'name', 'description']);
    if (params.sortOrder) {
        const desc = params.sortOrder === 'descending';
        const sortPorp = params.sortPorp;
        data = data.sort((a, b) => {
            if (desc) {
                return a[sortPorp] < b[sortPorp] ? 1 : -1;
            }

            return a[sortPorp] > b[sortPorp] ? 1 : -1;
        });
    }

    if (params.pageSize < 0) {
        return {
            items: data,
            total: data.length,
        };
    }
    return {
        items: data.slice((params.pageNumber - 1) * params.pageSize, params.pageNumber * params.pageSize),
        total: data.length,
    };
};

const requestAdd = async (formModel) => {
    await api.addGoods(formModel);
};

const requestEdit = async (formModel) => {
    await api.updateGoods(formModel.id, formModel);
};

const requestDetele = async (id) => {
    await api.deleteGoodsById(id);
};

const requestBatchDelete = async (selectedIds) => {
    await api.deleteGoodsByIds(selectedIds);
};

const request = {
    get: requestGet,
    add: requestAdd,
    edit: requestEdit,
    delete: requestDetele,
    batchDelete: requestBatchDelete,
};

const lastClickId = ref(0);

const associatedItemsVisible = ref(false);
const associatedCommandsVisible = ref(false);
const associatedData = ref([]);
const associatedLoading = ref(false);

const handleAssociatedItem = async (row) => {
    associatedLoading.value = true;
    associatedItemsVisible.value = true;
    lastClickId.value = row.id;
    try {
        const data = await api.getItemList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleItemsEdit = async (ids) => {
    await api.updateItemList(lastClickId.value, ids);
};

const handleAssociatedCommand = async (row) => {
    associatedLoading.value = true;
    associatedCommandsVisible.value = true;
    lastClickId.value = row.id;
    try {
        const data = await api.getCommandList(row.id);
        associatedData.value = data;
    } finally {
        associatedLoading.value = false;
    }
};

const handleCommandsEdit = async (ids) => {
    await api.updateCommandList(lastClickId.value, ids);
};
</script>
